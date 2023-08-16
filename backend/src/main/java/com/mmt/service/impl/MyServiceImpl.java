package com.mmt.service.impl;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.badge.Badge;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.entity.pay.PaymentHistory;
import com.mmt.domain.entity.review.Review;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.my.*;
import com.mmt.repository.BadgeRepository;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.PaymentRepository;
import com.mmt.repository.ReviewRepository;
import com.mmt.repository.lesson.LessonParticipantRepository;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.service.AwsS3Uploader;
import com.mmt.service.MyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyServiceImpl implements MyService {

    private final LessonParticipantRepository lessonParticipantRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final BadgeRepository badgeRepository;
    private final PaymentRepository paymentRepository;

    private final AwsS3Uploader awsS3Uploader;

    @Override
    public List<MyLessonRes> getMyLesson(String userId, boolean isCompleted) {
        List<MyLessonRes> result = new ArrayList<>();

        // 신청한 과외가 있는지 확인
        List<LessonParticipant> lessonParticipantList = getParticipant(userId);
        if(lessonParticipantList.size() == 0){
            MyLessonRes myLessonAppliedRes = new MyLessonRes();
            myLessonAppliedRes.setStatusCode(HttpStatus.OK);
            myLessonAppliedRes.setMessage("신청한 과외가 없습니다.");
            result.add(myLessonAppliedRes);
            return result;
        }

        // 신청한 과외 중 이미 시작한/시작하지 않은 과외가 있는지 확인
        List<LessonParticipant> list = getParticipant(lessonParticipantList, isCompleted);
        if(list.size() == 0){
            MyLessonRes myLessonRes = new MyLessonRes();
            myLessonRes.setStatusCode(HttpStatus.OK);
            myLessonRes.setMessage("신청한 과외가 없습니다.");
            result.add(myLessonRes);
            return result;
        }

        // 하나씩 세팅해서 결과값에 추가하기
        for(LessonParticipant lessonParticipant : list){
            MyLessonRes myLessonRes = new MyLessonRes(lessonParticipant.getLesson());

            // 참여 신청한 날짜와 마지막 수정 날짜 세팅
            myLessonRes.setCreatedDate(lessonParticipant.getCreatedDate().toString());
            myLessonRes.setModifiedDate(lessonParticipant.getModifiedDate().toString());

            // 해당 과외의 참여자 수를 불러와서 remaining 세팅
            int lessonId = lessonParticipant.getLesson().getLessonId();
            int cnt = getParticipant(lessonId);
            myLessonRes.setRemaining(lessonParticipant.getLesson().getMaximum() - cnt + 1);

            // status 세팅
            myLessonRes.setStatusCode(HttpStatus.OK);
            myLessonRes.setMessage("Success");

            result.add(myLessonRes);
        }

        if(!isCompleted){ // 신청한 과외 목록인 경우 과외 날짜순으로 정렬
            result.sort(new Comparator<MyLessonRes>() {
                @Override
                public int compare(MyLessonRes o1, MyLessonRes o2) {
                    return o1.getLessonDate().compareTo(o2.getLessonDate());
                }
            });
        }

        return result;
    }

    @Override
    public List<MyRecipeRes> getMyRecipe(String userId) {
        List<MyRecipeRes> result = new ArrayList<>();

        // 신청한 과외가 있는지 확인
        List<LessonParticipant> lessonParticipantList = getParticipant(userId);
        if(lessonParticipantList.size() == 0){
            MyRecipeRes myRecipeRes = new MyRecipeRes();
            myRecipeRes.setStatusCode(HttpStatus.OK);
            myRecipeRes.setMessage("신청한 과외가 없습니다.");
            result.add(myRecipeRes);
            return result;
        }

        // 완료한 과외 가져오기
        List<LessonParticipant> list = getParticipant(lessonParticipantList, true);
        if(list.size() == 0){
            MyRecipeRes myRecipeRes = new MyRecipeRes();
            myRecipeRes.setStatusCode(HttpStatus.OK);
            myRecipeRes.setMessage("신청한 과외가 없습니다.");
            result.add(myRecipeRes);
            return result;
        }

        // lesson 정보 받아와서 세팅
        for(LessonParticipant lessonParticipant : list){
            MyRecipeRes myRecipeRes = new MyRecipeRes(lessonParticipant.getLesson());

            // status 세팅
            myRecipeRes.setStatusCode(HttpStatus.OK);
            myRecipeRes.setMessage("Success");

            result.add(myRecipeRes);
        }

        return result;
    }

    @Override
    public List<MyReviewRes> getMyReview(String userId) {
        List<MyReviewRes> result = new ArrayList<>();
        List<Review> reviewList = reviewRepository.findAllByMember_UserId(userId);

        // 작성한 리뷰가 있는지 확인
        if(reviewList.size() == 0){
            MyReviewRes myReviewRes = new MyReviewRes();
            myReviewRes.setStatusCode(HttpStatus.OK);
            myReviewRes.setMessage("작성한 리뷰가 없습니다.");
            result.add(myReviewRes);
            return result;
        }

        for(Review review : reviewList){
            MyReviewRes myReviewRes = new MyReviewRes(review);
            myReviewRes.setStatusCode(HttpStatus.OK);
            myReviewRes.setMessage("Success");
            result.add(myReviewRes);
        }

        return result;
    }

    @Transactional
    @Override
    public ResponseDto registerLicense(String userId, MultipartFile multipartFile) {
        Optional<Member> member = memberRepository.findByUserId(userId);
        if(member.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다.");
        }
        if(!member.get().getRole().equals(Role.COOKYER)){
            return new ResponseDto(HttpStatus.FORBIDDEN, "Cookyer만 이용할 수 있습니다.");
        }

        // s3에 자격증 이미지 업로드 후 url을 db에 저장
        Badge badge = new Badge();
        badge.setMember(member.get());
        if(multipartFile != null){
            try {
                String capture = awsS3Uploader.uploadFile(multipartFile, "license");
                badge.setCapture(capture);
            } catch (IOException e) {
                return new ResponseDto(HttpStatus.CONFLICT, e.getMessage());
            }
        }
        badgeRepository.save(badge);

        return new ResponseDto(HttpStatus.CREATED, "Success");
    }

    @Override
    public List<MyBadgeRes> getLicenseList(String userId) {
        List<MyBadgeRes> myBadgeResList = new ArrayList<>();
        Optional<Member> member = memberRepository.findByUserId(userId);
        if(member.isEmpty()){
            MyBadgeRes myBadgeRes = new MyBadgeRes();
            myBadgeRes.setStatusCode(HttpStatus.NOT_FOUND);
            myBadgeRes.setMessage("존재하지 않는 아이디입니다.");
            myBadgeResList.add(myBadgeRes);
            return myBadgeResList;
        }
        if(!member.get().getRole().equals(Role.COOKYER)){
            MyBadgeRes myBadgeRes = new MyBadgeRes();
            myBadgeRes.setStatusCode(HttpStatus.FORBIDDEN);
            myBadgeRes.setMessage("Cookyer만 확인할 수 있습니다.");
            myBadgeResList.add(myBadgeRes);
            return myBadgeResList;
        }

        List<Badge> badgeList = badgeRepository.findAllByMember_UserId(userId);
        if(badgeList.size() == 0){
            MyBadgeRes myBadgeRes = new MyBadgeRes();
            myBadgeRes.setStatusCode(HttpStatus.NOT_FOUND);
            myBadgeRes.setMessage("등록한 자격증이 존재하지 않습니다.");
            myBadgeResList.add(myBadgeRes);
            return myBadgeResList;
        }

        for (Badge badge : badgeList){
            MyBadgeRes myBadgeRes = new MyBadgeRes(badge);
            myBadgeRes.setStatusCode(HttpStatus.OK);
            myBadgeRes.setMessage("Success");
            myBadgeResList.add(myBadgeRes);
        }

        return myBadgeResList;
    }

    @Transactional
    @Override
    public ResponseDto deleteProfileImg(String userId) {
        Optional<Member> member = memberRepository.findByUserId(userId);
        if(member.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 계정입니다.");
        }

        if(member.get().getProfileImg().isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "등록한 프로필 사진이 존재하지 않습니다.");
        }

        member.get().setProfileImg(null);
        memberRepository.save(member.get());
        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public List<MyPaymentRes> getCookieePayment(String UserId) {
        List<PaymentHistory> paymentList = paymentRepository.findAllByMember_UserIdAndPayStatusNot(UserId, PayStatus.READY);
        List<MyPaymentRes> result = new ArrayList<>();

        if(paymentList.size() == 0) {
            result.add(new MyPaymentRes(HttpStatus.OK, "결제 내역이 없습니다."));
        }

        for(PaymentHistory paymentHistory : paymentList) {
            MyPaymentRes myPaymentRes = new MyPaymentRes(paymentHistory);
            if(paymentHistory.getCanceledAt() != null) {
                myPaymentRes.setCanceledAt(paymentHistory.getCanceledAt().toString());
            }
            if(paymentHistory.getApprovedAt() != null) {
                myPaymentRes.setApprovedAt(paymentHistory.getApprovedAt().toString());
            }
            myPaymentRes.setStatusCode(HttpStatus.OK);
            myPaymentRes.setMessage("success");

            result.add(myPaymentRes);
        }

        return result;
    }

    @Override
    public List<MyPaymentRes> getCookyerPayment(String userId) {
        List<PaymentHistory> paymentList = paymentRepository.findAllByLesson_CookyerIdAndPayStatusNot(userId, PayStatus.READY);
        List<MyPaymentRes> result = new ArrayList<>();

        if(paymentList.size() == 0) {
            result.add(new MyPaymentRes(HttpStatus.OK, "정산 내역이 없습니다."));
        }

        for(PaymentHistory paymentHistory : paymentList) {
            MyPaymentRes myPaymentRes = new MyPaymentRes(paymentHistory);
            if(paymentHistory.getCanceledAt() != null) {
                myPaymentRes.setCanceledAt(paymentHistory.getCanceledAt().toString());
            }
            if(paymentHistory.getApprovedAt() != null) {
                myPaymentRes.setApprovedAt(paymentHistory.getApprovedAt().toString());
            }
            myPaymentRes.setStatusCode(HttpStatus.OK);
            myPaymentRes.setMessage("success");

            result.add(myPaymentRes);
        }

        return result;
    }

    private List<LessonParticipant> getParticipant(List<LessonParticipant> list, boolean isCompleted){
        // 파라미터와 동일한 상태의 참여자 목록 반환
        for(int i=list.size()-1; i>=0; i--){
            if(list.get(i).isCompleted() != isCompleted){
                list.remove(i);
            }
        }
        return list;
    }

    private List<LessonParticipant> getParticipant(String userId){
        // 사용자가 참여한 과외 목록 불러오기
        return lessonParticipantRepository.findAllByMember_UserId(userId);
    }

    private int getParticipant(int lessonId){
        // 해당 과외의 참여자 수 불러오기
        return lessonParticipantRepository.findAllByLesson_LessonId(lessonId).size();
    }

}
