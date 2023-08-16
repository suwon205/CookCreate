package com.mmt.service.impl;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.badge.Badge;
import com.mmt.domain.entity.badge.Certificated;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonCategory;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.entity.lesson.LessonStep;
import com.mmt.domain.request.jjim.JjimReq;
import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.entity.pay.PaymentHistory;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import com.mmt.domain.request.lesson.LessonSearchReq;
import com.mmt.domain.request.lesson.LessonStepPutReq;
import com.mmt.domain.request.session.SessionPostReq;
import com.mmt.domain.response.lesson.*;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.review.ReviewAvgRes;
import com.mmt.repository.*;
import com.mmt.repository.lesson.LessonCategoryRepository;
import com.mmt.repository.lesson.LessonParticipantRepository;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.repository.lesson.LessonStepRepository;
import com.mmt.service.AwsS3Uploader;
import com.mmt.service.LessonService;
import com.mmt.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final LessonCategoryRepository lessonCategoryRepository;
    private final LessonParticipantRepository lessonParticipantRepository;
    private final LessonStepRepository lessonStepRepository;
    private final MemberRepository memberRepository;
    private final PaymentRepository paymentRepository;
    private final BadgeRepository badgeRepository;

    private final ReviewService reviewService;
    private final AwsS3Uploader awsS3Uploader;

    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    @Override
    public ResponseDto reserve(LessonPostReq lessonPostReq) {
        Lesson lesson = new Lesson(lessonPostReq);

        // lesson에 카테고리 아이디 저장
        LessonCategory lessonCategory = new LessonCategory();
        lessonCategory.setCategoryId(Integer.parseInt(lessonPostReq.getCategoryId()));
        lesson.setLessonCategory(lessonCategory);

        // lesson에 cookyer 닉네임 저장
        Optional<Member> cookyer = memberRepository.findByUserId(lessonPostReq.getCookyerId());
        cookyer.ifPresent(member -> lesson.setCookyerName(member.getNickname()));

        // s3에 썸네일 이미지 업로드 후 url을 db에 저장
        if(lessonPostReq.getThumbnailUrl() != null){
            try {
                String thumbnailUrl = awsS3Uploader.uploadFile(lessonPostReq.getThumbnailUrl(), "lesson");
                lesson.setThumbnailUrl(thumbnailUrl);
            } catch (IOException e) {
                return new ResponseDto(HttpStatus.CONFLICT, e.getMessage());
            }
        }

        Lesson save = lessonRepository.save(lesson);

        // 진행 단계에 lesson id 저장
        for(LessonStep lessonStep : save.getLessonStepList()){
            lessonStep.setLesson(save);
            lessonStepRepository.save(lessonStep);
        }

        // 참여자 목록에 lesson 세팅, 선생님 아이디 추가
        LessonParticipant lessonParticipant = new LessonParticipant();
        lessonParticipant.setLesson(save);
        lessonParticipant.setMember(cookyer.get());
        lessonParticipant.setCompleted(false);
        lessonParticipantRepository.save(lessonParticipant);

        // TODO: 채팅방 생성

        return new ResponseDto(HttpStatus.CREATED, "Success");
    }

    @Override
    public LessonApplyRes apply(int lessonId, String userId) {
        LessonApplyRes lessonApplyRes = new LessonApplyRes();

        Optional<Lesson> lesson = lessonRepository.findByLessonId(lessonId);
        if(lesson.isEmpty()) {
            lessonApplyRes.setStatusCode(HttpStatus.NOT_FOUND);
            lessonApplyRes.setMessage("존재하지 않는 과외입니다.");
            return lessonApplyRes;
        }

        if(lesson.get().getIsOver()) {
            lessonApplyRes.setStatusCode(HttpStatus.BAD_REQUEST);
            lessonApplyRes.setMessage("이미 마감된 과외입니다.");
            return lessonApplyRes;
        }

        // 추가하기 전 결제 완료 확인
        Optional<PaymentHistory> paymentHistory = paymentRepository.findFirstByLesson_LessonIdAndMember_UserIdOrderByApprovedAtDesc(lessonId, userId);
        if(!paymentHistory.isPresent() || paymentHistory.get().getPayStatus() != PayStatus.COMPLETED) {
            lessonApplyRes.setStatusCode(HttpStatus.FORBIDDEN);
            lessonApplyRes.setMessage("결제 한 사용자만 신청할 수 있습니다.");
            return lessonApplyRes;
        }

        LessonParticipant lessonParticipant = new LessonParticipant();
        lessonParticipant.setLesson(lesson.get());
        Optional<Member> member = memberRepository.findByUserId(userId);
        lessonParticipant.setMember(member.get());
        lessonParticipant.setCompleted(false);
        lessonParticipantRepository.save(lessonParticipant);

        // 만약 방금 신청한 사람이 마지막 사람이라면 lesson의 is_over = true로 세팅
        List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByLesson_LessonId(lessonId);
        int participating = lessonParticipantList.size() - 1; // 참여 중인 쿠키 수(쿠커 제외)
        if(participating == lesson.get().getMaximum()){
            lesson.get().setIsOver(true);
            lessonRepository.save(lesson.get());
        }

        // 결과값 세팅
        lessonApplyRes = new LessonApplyRes(lesson.get());
        lessonApplyRes.setStatusCode(HttpStatus.OK);
        lessonApplyRes.setMessage("Success");

        return lessonApplyRes;
    }

    @Transactional
    @Override
    public ResponseDto modifyLesson(LessonPutReq lessonPutReq) {
        Optional<Lesson> find = lessonRepository.findByLessonId(Integer.parseInt(lessonPutReq.getLessonId()));

        if(find.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");

        // 저장된 단계들 삭제 -> 순서, 개수, 내용 모두 바뀔 수 있음
        lessonStepRepository.deleteAllByLesson_LessonId(Integer.parseInt(lessonPutReq.getLessonId()));

        // 변경된 값만 저장
        Lesson lesson = find.get();
        lesson.update(lessonPutReq);

        // lesson에 카테고리 아이디 저장
        LessonCategory lessonCategory = new LessonCategory();
        lessonCategory.setCategoryId(Integer.parseInt(lessonPutReq.getCategoryId()));
        lesson.setLessonCategory(lessonCategory);

        // s3에 썸네일 이미지 업로드 후 url을 db에 저장
        if(lessonPutReq.getThumbnailUrl() != null){
            try {
                String thumbnailUrl = awsS3Uploader.uploadFile(lessonPutReq.getThumbnailUrl(), "lesson");
                lesson.setThumbnailUrl(thumbnailUrl);
            } catch (IOException e) {
                return new ResponseDto(HttpStatus.CONFLICT, e.getMessage());
            }
        }

        Lesson save = lessonRepository.save(lesson);

        // 새로운 진행 단계에 lesson id 저장
        for(LessonStep lessonStep : save.getLessonStepList()){
            lessonStep.setLesson(save);
            lessonStepRepository.save(lessonStep);
        }

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto deleteLesson(int lessonId) {
        List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByLesson_LessonId(lessonId);
        if(lessonParticipantList.size() > 1){
            // 선생님 외에 참여한 사람이 있으면
            return new ResponseDto(HttpStatus.CONFLICT, "과외를 신청한 Cookiee가 있어 삭제할 수 없습니다.");
        }

        try {
            lessonRepository.deleteByLessonId(lessonId);
        }catch (EmptyResultDataAccessException e){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto cancelLesson(int lessonId, String userId) {
        Optional<Lesson> lesson = lessonRepository.findByLessonId(lessonId);
        if(lesson.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }
        if(lesson.get().getIsOver()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 마감된 과외입니다.");
        }
        if(lesson.get().getIsEnd()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 종료된 과외입니다.");
        }

        Optional<Member> member = memberRepository.findByUserId(userId);
        if(member.isEmpty()) {
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다.");
        }
        if(!member.get().getRole().equals(Role.COOKIEE)){
            return new ResponseDto(HttpStatus.FORBIDDEN, "신청한 Cookiee만 이용 가능합니다.");
        }

        Optional<LessonParticipant> lessonParticipant = lessonParticipantRepository.findByLesson_LessonIdAndMember_UserId(lessonId, userId);
        if(lessonParticipant.isEmpty()) {
            return new ResponseDto(HttpStatus.FORBIDDEN, "신청한 Cookiee만 이용 가능합니다.");
        }

        lessonParticipantRepository.delete(lessonParticipant.get());

        // 마감된 과외였다면 is_over = false로
//        if(lesson.get().getIsOver()){
//            lesson.get().setIsOver(false);
//            lessonRepository.save(lesson.get());
//        }

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public List<LessonSearchRes> getLessonList(LessonSearchReq lessonSearchReq) {
        // 키워드 포함 여부, 가나다순/가격순 정렬까지만한 결과
        List<Lesson> lessonList = lessonRepository.findBySearchOption(lessonSearchReq);
        List<LessonSearchRes> result = new ArrayList<>();
        for(Lesson lesson : lessonList){
            LessonSearchRes lessonSearchRes = new LessonSearchRes(lesson);

            // remaining 세팅
            List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByLesson_LessonId(lesson.getLessonId());
            lessonSearchRes.setRemaining(lesson.getMaximum() - lessonParticipantList.size() + 1);

            // reviewAvg 세팅
            ReviewAvgRes reviewAvgRes = reviewService.getReviewAvg(lesson.getCookyerId());
            lessonSearchRes.setReviewAvg(reviewAvgRes.getAvg());
            lessonSearchRes.setReviewCnt(reviewAvgRes.getCount());
            lessonSearchRes.setReviewSum(reviewAvgRes.getSum());

            // 카테고리 포함 여부
            if(lessonSearchReq.getCategory() != null && !lessonSearchReq.getCategory().isEmpty()){
                List<Integer> categoryList = lessonSearchReq.getCategory();
                boolean isContain = false;
                for (int category : categoryList){
                    if(lesson.getLessonCategory().getCategoryId() == category){
                        isContain = true;
                        break;
                    }
                }
                if(!isContain) { // 카테고리가 포함된게 아니면 반환값에 추가할 필요 없음
                    continue;
                }
            }

            // 마감과외 숨기기/보여주기 -> 마감은 과외 시작 시간 12시간 전
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd\'T\'HH:mm:ss");
            LocalDateTime lessonDate = LocalDateTime.parse(lesson.getLessonDate(), formatter).minusHours(12);
            LocalDateTime now = LocalDateTime.now();
            if(lessonSearchReq.isDeadline()){
                // 숨기기
                if(now.isAfter(lessonDate)){
                    continue;
                }
            }
            lessonSearchRes.setToDeadline(Duration.between(now, lessonDate).getSeconds());
            System.out.println(lessonSearchRes.getToDeadline());
            result.add(lessonSearchRes);
        }
        // 마감임박순 정렬 -> 0에 가까운 순서 -> 음수는 맨뒤로
        if(lessonSearchReq.getOrder() != null && !lessonSearchReq.getOrder().isEmpty()){
            if(lessonSearchReq.getOrder().equals("date")){
                Collections.sort(result, new Comparator<LessonSearchRes>() {
                    @Override
                    public int compare(LessonSearchRes o1, LessonSearchRes o2) {
                        return (int) (o1.getToDeadline() - o2.getToDeadline());
                    }
                });

                for (int i=result.size()-1; i>=0; i--){
                    if(result.get(i).getToDeadline() < 0){
                        LessonSearchRes lessonSearchRes = result.get(i);
                        result.remove(lessonSearchRes);
                        result.add(lessonSearchRes);
                    }
                }
            }else if(lessonSearchReq.getOrder().equals("avg")){ // 선생님이 받은 평점순으로 정렬
                Collections.sort(result, new Comparator<LessonSearchRes>() {
                    @Override
                    public int compare(LessonSearchRes o1, LessonSearchRes o2) {
                        return Float.compare(o2.getReviewAvg(), o1.getReviewAvg());
                    }
                });
            }else if(lessonSearchReq.getOrder().equals("review")){ // 선생님이 받은 리뷰 개수순으로 정렬
                Collections.sort(result, new Comparator<LessonSearchRes>() {
                    @Override
                    public int compare(LessonSearchRes o1, LessonSearchRes o2) {
                        return Integer.compare(o2.getReviewCnt(), o1.getReviewCnt());
                    }
                });
            }
        }

        return result;
    }

    @Override
    public LessonDetailRes getLessonDetail(int lessonId) {
        Optional<Lesson> lesson = lessonRepository.findByLessonId(lessonId);
        LessonDetailRes result = new LessonDetailRes();
        if(lesson.isPresent()) {
            result = new LessonDetailRes(lesson.get());

            // categoryName 세팅
            Optional<LessonCategory> lessonCategory = lessonCategoryRepository.findById(lesson.get().getLessonCategory().getCategoryId());
            if(lessonCategory.isPresent()) result.setCategoryName(lessonCategory.get().getCategoryTitle());

            List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByLesson_LessonId(lessonId);
//            result.setLessonParticipantList(lessonParticipantList);
            // remaining 세팅
            result.setRemaining(result.getMaximum() - lessonParticipantList.size() + 1);

            // lessonStepList 세팅
            List<LessonStep> lessonStepList = lessonStepRepository.findByLesson_LessonId(lessonId);
            result.setLessonStepList(lessonStepList);

            // reviewAvg 세팅
            ReviewAvgRes reviewAvgRes = reviewService.getReviewAvg(lesson.get().getCookyerId());
            result.setReviewAvg(reviewAvgRes.getAvg());
            result.setReviewCnt(reviewAvgRes.getCount());
            result.setReviewSum(reviewAvgRes.getSum());

            // cookyer 정보 추가 반환
            Optional<Member> cookyer = memberRepository.findByUserId(result.getCookyerId());
            result.setPhoneNumber(cookyer.get().getPhoneNumber());
            result.setUserEmail(cookyer.get().getUserEmail());
            if(cookyer.get().getFood() != null && !cookyer.get().getFood().equals("")){
                result.setFood(Arrays.stream(cookyer.get().getFood().split(","))
                        .map(Integer::parseInt)
                        .collect(Collectors.toList()));
            }
            result.setIntroduce(cookyer.get().getIntroduce());
            result.setProfileImg(cookyer.get().getProfileImg());

            // 승인된 뱃지가 있는지 확인
            List<Badge> badgeList = badgeRepository.findAllByMember_UserId(result.getCookyerId());
            if(badgeList.size() == 0){
                result.setApproved(false);
            }else{
                boolean isApproved = false;
                for (Badge badge : badgeList){
                    if(badge.getCertificated().equals(Certificated.ACCESS)){
                        isApproved = true;
                        break;
                    }
                }
                result.setApproved(isApproved);
            }

            return result;
        }else{
            return null;
        }
    }

    @Override
    public LessonLatestRes getLessonLatest(String userId) {
        LessonLatestRes lessonLatestRes = new LessonLatestRes();
        List<Lesson> lessonList = lessonRepository.findAllByCookyerId(userId, Sort.by(Sort.Direction.DESC, "createdDate"));

        if(lessonList.size() == 0){
            lessonLatestRes.setStatusCode(HttpStatus.NOT_FOUND);
            lessonLatestRes.setMessage("이전에 예약한 화상 과외 내역이 없습니다.");
        }else{
            lessonLatestRes = new LessonLatestRes(lessonList.get(0));
            lessonLatestRes.setStatusCode(HttpStatus.OK);
            lessonLatestRes.setMessage("Success");
        }

        return lessonLatestRes;
    }

    @Override
    public ResponseDto getHavingBadge(String cookyerId) {
        // 회원 조회 확인 절차
        Optional<Member> member = memberRepository.findByUserId(cookyerId);
        if(member.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 계정입니다.");
        }

        // 뱃지 불러오기
        List<Badge> badgeList = badgeRepository.findAllByMember_UserId(cookyerId);
        if(badgeList.size() == 0){ // 신청한 뱃지가 있는지 확인
            return new ResponseDto(HttpStatus.OK, "X");
        }
        for(Badge badge : badgeList){ // 인증된 뱃지가 있는지 확인
            if(badge.getCertificated().equals(Certificated.ACCESS)){
                return new ResponseDto(HttpStatus.OK, "O");
            }
        }

        return new ResponseDto(HttpStatus.OK, "X");
    }

    @Override
    public List<LessonStepRes> getLessonStep(int lessonId) {
        List<LessonStep> lessonStepList = lessonStepRepository.findByLesson_LessonId(lessonId);
        List<LessonStepRes> result = new ArrayList<>();
        for(LessonStep lessonStep : lessonStepList){
            LessonStepRes lessonStepRes = new LessonStepRes(lessonStep);
            result.add(lessonStepRes);
        }
        return result;
    }

    @Transactional
    @Override
    public ResponseDto modifyLessonStep(String userId, LessonStepPutReq lessonStepPutReq) {
        Optional<Lesson> find = lessonRepository.findByLessonId(lessonStepPutReq.getLessonId());

        if(find.isEmpty()) {
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }
        if(!find.get().getCookyerId().equals(userId)){
            return new ResponseDto(HttpStatus.UNAUTHORIZED, "해당 과외의 Cookyer만 이용 가능합니다");
        }

        // 저장된 단계들 삭제 -> 순서, 개수, 내용 모두 바뀔 수 있음
        lessonStepRepository.deleteAllByLesson_LessonId(lessonStepPutReq.getLessonId());

        for(LessonStep ls : lessonStepPutReq.getLessonStepList()){
            LessonStep lessonStep = new LessonStep();
            lessonStep.setStepOrder(ls.getStepOrder());
            lessonStep.setStepContent(ls.getStepContent());
            lessonStep.setLesson(find.get());
            lessonStepRepository.save(lessonStep);
        }

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto createSession(SessionPostReq sessionPostReq) {
        Optional<Lesson> lesson = lessonRepository.findByLessonId(sessionPostReq.getLessonId());
        if(lesson.isEmpty()) {
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }

        Optional<Member> member = memberRepository.findByUserId(sessionPostReq.getUserId());
        if(member.isEmpty()) {
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다.");
        }

        if(!member.get().getRole().equals(Role.COOKYER)){
            return new ResponseDto(HttpStatus.FORBIDDEN, "Cookyer만 세션을 생성할 수 있습니다.");
        }
        if(!lesson.get().getCookyerId().equals(member.get().getUserId())){
            return new ResponseDto(HttpStatus.FORBIDDEN, "과외를 예약한 Cookyer만 세션을 생성할 수 있습니다.");
        }

        if(lesson.get().getIsEnd()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 종료된 과외입니다.");
        }
//        if(lesson.get().getSessionId() != null){
//            return new ResponseDto(HttpStatus.CONFLICT, "이미 세션이 생성되어 있습니다.");
//        }

//        String customSessionId = RandomStringUtils.randomAlphanumeric(15);
        lesson.get().setSessionId(sessionPostReq.getSessionId());
        lessonRepository.save(lesson.get());

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public ResponseDto checkSession(SessionPostReq sessionPostReq) {
        List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByLesson_LessonId(sessionPostReq.getLessonId());

        // 과외를 신청했는지 확인
        boolean isApplied = false;
        for(LessonParticipant lessonParticipant : lessonParticipantList){
            if(lessonParticipant.getMember().getUserId().equals(sessionPostReq.getUserId())){
                isApplied = true;
                break;
            }
        }
        if(!isApplied){
            return new ResponseDto(HttpStatus.FORBIDDEN, "해당 과외를 신청한 회원만 입장할 수 있습니다.");
        }

        // 과외가 존재하는지 확인
        Optional<Lesson> lesson = lessonRepository.findByLessonId(sessionPostReq.getLessonId());
        if(lesson.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }
        if(lesson.get().getIsEnd()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 종료된 과외입니다.");
        }

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public String getSessionId(int lessonId) {
        return lessonRepository.findByLessonId(lessonId).get().getSessionId();
    }

    @Transactional
    @Override
    public ResponseDto deleteSession(SessionPostReq sessionPostReq) {
        Optional<Lesson> find= lessonRepository.findByLessonId(sessionPostReq.getLessonId());
        if(find.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }
        if(!find.get().getCookyerId().equals(sessionPostReq.getUserId())){
            return new ResponseDto(HttpStatus.FORBIDDEN, "과외를 예약한 Cookyer만 닫을 수 있습니다.");
        }
        if(find.get().getSessionId() == null){
            return new ResponseDto(HttpStatus.NOT_FOUND, "생성된 세션이 없습니다.");
        }
        if(find.get().getIsEnd()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 종료된 과외입니다.");
        }

        lessonRepository.updateIsEnd(true, sessionPostReq.getLessonId());
        lessonParticipantRepository.updateCompleted(true, sessionPostReq.getLessonId());

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto wantJjimOrNot(JjimReq jjimReq) {
        int lessonId = jjimReq.getLessonId();
        Optional<Lesson> lesson = lessonRepository.findByLessonId(lessonId);
        if(lesson.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }
        if(lesson.get().getIsOver() || lesson.get().getIsEnd()){
            return new ResponseDto(HttpStatus.CONFLICT, "이미 마감된 과외입니다.");
        }

        Optional<Member> member = memberRepository.findByUserId(jjimReq.getUserId());
        if(!member.get().getRole().equals(Role.COOKIEE)){
            return new ResponseDto(HttpStatus.FORBIDDEN, "Cookiee만 이용할 수 있습니다.");
        }

        SetOperations<String, Object> setOperations = redisTemplate.opsForSet();

//        예제
//        setOperations.add("Key", chatMessage);
//        System.out.println(setOperations.pop("Key"));       // 하나 꺼내기
//        System.out.println(setOperations.members("Key"));  // 전체 조회

        String key = "lessonId::" + jjimReq.getLessonId();
        String value = jjimReq.getUserId();
        if(Boolean.TRUE.equals(setOperations.isMember(key, value))){
            setOperations.remove(key, value);
            return new ResponseDto(HttpStatus.OK, "찜한 목록에서 제거됐습니다.");
        }else{
            setOperations.add(key, value);
            return new ResponseDto(HttpStatus.OK, "찜한 목록에 추가됐습니다.");
        }

//        setOperations.pop(key);
//        if(){
//            setOperations.getOperations().get
//            setOperations.put(key, hashkey, lesson.get().getJjimCount());
//            setOperations.increment(key, hashkey,1);
//            System.out.println(setOperations.get(key, hashkey));
//        }else {
//            setOperations.increment(key, hashkey,1);
//            System.out.println(setOperations.get(key, hashkey));
//        }
    }

//    @Scheduled(fixedDelay = 1000L*18L)
//    @Transactional
//    @Override
//    public void cancelJjim(){
//        String hashkey = "likes";
//        Set<String> Rediskey = redisTemplate.keys("lessonId*");
//        Iterator<String> it = Rediskey.iterator();
//        while (it.hasNext()) {
//            String data = it.next();
//            int lessonId = Integer.parseInt(data.split("::")[1]);
//            if (redisTemplate.opsForHash().get(data, hashkey) == null){
//                break;
//            }
//            int jjimCnt = Integer.parseInt((String.valueOf(redisTemplate.opsForHash().get(data, hashkey))));
//            //problemRepositoryImp.wantJjim(lessonId, jjimCnt);
//            redisTemplate.opsForHash().delete(data, hashkey);
//        }
//        System.out.println("likes update complete");
//    }
}
