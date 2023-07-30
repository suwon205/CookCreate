package com.mmt.service.impl;

import com.mmt.domain.entity.Auth.Member;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonCategory;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.entity.lesson.LessonStep;
import com.mmt.domain.entity.pay.PaymentHistory;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import com.mmt.domain.request.lesson.LessonSearchReq;
import com.mmt.domain.request.session.SessionCreateReq;
import com.mmt.domain.response.lesson.LessonDetailRes;
import com.mmt.domain.response.lesson.LessonLatestRes;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.lesson.LessonSearchRes;
import com.mmt.domain.response.review.ReviewAvgRes;
import com.mmt.repository.*;
import com.mmt.repository.lesson.LessonCategoryRepository;
import com.mmt.repository.lesson.LessonParticipantRepository;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.repository.lesson.LessonStepRepository;
import com.mmt.service.LessonService;
import com.mmt.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final LessonCategoryRepository lessonCategoryRepository;
    private final LessonParticipantRepository lessonParticipantRepository;
    private final LessonStepRepository lessonStepRepository;
    private final MemberRepository memberRepository;
    private final PaymentRepository paymentRepository;

    private final ReviewService reviewService;

    @Transactional
    @Override
    public ResponseDto reserve(LessonPostReq lessonPostReq) {
        Lesson lesson = new Lesson(lessonPostReq);

        // lesson에 카테고리 아이디 저장
        LessonCategory lessonCategory = new LessonCategory();
        lessonCategory.setCategoryId(lessonPostReq.getCategoryId());
        lesson.setLessonCategory(lessonCategory);

        // lesson에 cookyer 닉네임 저장
        Optional<Member> cookyer = memberRepository.findByUserId(lessonPostReq.getCookyerId());
        cookyer.ifPresent(member -> lesson.setCookyerName(member.getNickname()));

        Lesson save = lessonRepository.save(lesson);

        // 진행 단계에 lesson id 저장
        for(LessonStep lessonStep : save.getLessonStepList()){
            lessonStep.setLesson(save);
            lessonStepRepository.save(lessonStep);
        }

        // 참여자 목록에 lesson 세팅, 선생님 아이디 추가
        LessonParticipant lessonParticipant = new LessonParticipant();
        lessonParticipant.setLesson(save);
        lessonParticipant.setUserId(lessonPostReq.getCookyerId());
        lessonParticipant.setCompleted(false);
        lessonParticipantRepository.save(lessonParticipant);

        // TODO: 채팅방 생성

        return new ResponseDto(HttpStatus.CREATED, "Success");
    }

    @Override
    public ResponseDto apply(int lessonId, String userId) {
        Optional<Lesson> lesson = lessonRepository.findByLessonId(lessonId);
        if(lesson.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");

        // TODO: 추가하기 전 결제 완료 확인
        if(!paymentRepository.findByLesson_LessonIdAndMember_UserId(lessonId, userId).isPresent()) {
            return new ResponseDto(HttpStatus.FORBIDDEN, "결제 한 사용자만 신청할 수 있습니다.");
        }
        LessonParticipant lessonParticipant = new LessonParticipant();
        lessonParticipant.setLesson(lesson.get());
        lessonParticipant.setUserId(userId);
        lessonParticipant.setCompleted(false);
        lessonParticipantRepository.save(lessonParticipant);

        // TODO: 채팅방 입장

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto modifyLesson(LessonPutReq lessonPutReq) {
        Optional<Lesson> find = lessonRepository.findByLessonId(lessonPutReq.getLessonId());

        if(find.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");

        // 저장된 단계들 삭제 -> 순서, 개수, 내용 모두 바뀔 수 있음
        lessonStepRepository.deleteAllByLesson_LessonId(lessonPutReq.getLessonId());

        // 변경된 값만 저장
        Lesson lesson = find.get();
        lesson.update(lessonPutReq);

        // lesson에 카테고리 아이디 저장
        LessonCategory lessonCategory = new LessonCategory();
        lessonCategory.setCategoryId(lessonPutReq.getCategoryId());
        lesson.setLessonCategory(lessonCategory);

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
        try {
            lessonRepository.deleteByLessonId(lessonId);
        }catch (EmptyResultDataAccessException e){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }

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
            List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findByLesson_LessonId(lesson.getLessonId());
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

            // lessonParticipantList 세팅
            List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findByLesson_LessonId(lessonId);
            List<Member> memberList = new ArrayList<>();
            for (LessonParticipant lp : lessonParticipantList){
                Member member = new Member();
                String userId = lp.getUserId();
                member.setUserId(userId);
                member.setNickname(memberRepository.findByUserId(userId).get().getNickname());
                memberList.add(member);
            }
            result.setLessonParticipantList(memberList);

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
    public ResponseDto createSession(int lessonId, SessionCreateReq sessionCreateReq) {
        Optional<Lesson> find = lessonRepository.findByLessonId(lessonId);

        if(find.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");

        // session_id 컬럼 set
        Lesson lesson = find.get();
        lesson.setSessionId(sessionCreateReq.getSessionId());
        lessonRepository.save(lesson);
        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public ResponseDto shutdownSession(int lessonId) {
        Optional<Lesson> find = lessonRepository.findByLessonId(lessonId);
        if(find.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");

        // session_id 컬럼 값을 null 로 set
        Lesson lesson = find.get();
        lesson.setSessionId(null);
        lessonRepository.save(lesson);
        return new ResponseDto(HttpStatus.OK, "Success");
    }
}
