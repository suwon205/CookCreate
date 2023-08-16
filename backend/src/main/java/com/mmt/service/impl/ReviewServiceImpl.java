package com.mmt.service.impl;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.review.Review;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.request.review.ReviewPostReq;
import com.mmt.domain.request.review.ReviewPutReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.review.ReviewAvgRes;
import com.mmt.domain.response.review.ReviewCookyerRes;
import com.mmt.domain.response.review.ReviewDetailRes;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.ReviewRepository;
import com.mmt.repository.lesson.LessonParticipantRepository;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final LessonRepository lessonRepository;
    private final LessonParticipantRepository lessonParticipantRepository;
    private final MemberRepository memberRepository;

    @Transactional
    @Override
    public ResponseDto register(ReviewPostReq reviewPostReq) {
        // 존재하는 과외인지 확인
        Optional<Lesson> lesson = lessonRepository.findByLessonId(reviewPostReq.getLessonId());
        if(lesson.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다.");
        }

        // 신청한 사용자인지 확인
        Optional<LessonParticipant> lessonParticipant = lessonParticipantRepository.findByLesson_LessonIdAndMember_UserId(reviewPostReq.getLessonId(), reviewPostReq.getUserId());
        if(lessonParticipant.isEmpty()){
            return new ResponseDto(HttpStatus.FORBIDDEN, "수강한 Cookiee만 이용 가능합니다");
        }

        Review review = new Review(reviewPostReq);
        review.setLesson(lesson.get());
        Optional<Member> member = memberRepository.findByUserId(reviewPostReq.getUserId());
        review.setMember(member.get());

        reviewRepository.save(review);

        return new ResponseDto(HttpStatus.CREATED, "Success");
    }

    @Override
    public List<ReviewCookyerRes> getCookyerReview(String cookyerId) {
        List<ReviewCookyerRes> reviewCookyerResList = new ArrayList<>();

        // 존재하는 cookyer인지 확인
        Optional<Member> member = memberRepository.findByUserId(cookyerId);
        if(member.isEmpty()){
            ReviewCookyerRes reviewCookyerRes = new ReviewCookyerRes();
            reviewCookyerRes.setStatusCode(HttpStatus.NOT_FOUND);
            reviewCookyerRes.setMessage("존재하지 않는 Cookyer입니다.");
            reviewCookyerResList.add(reviewCookyerRes);
            return reviewCookyerResList;
        }


        // cookyer가 진행한 과외 목록 불러오기
        List<Lesson> lessonList = lessonRepository.findAllByCookyerId(cookyerId);
        for (Lesson lesson : lessonList) {
            // 각 과외 별로 존재하는 리뷰 목록 불러오기
            List<Review> reviewList = reviewRepository.findAllByLesson_LessonId(lesson.getLessonId());
            for (Review review : reviewList) {
                ReviewCookyerRes reviewCookyerRes = new ReviewCookyerRes(review);
                reviewCookyerRes.setStatusCode(HttpStatus.OK);
                reviewCookyerRes.setMessage("Success");
                reviewCookyerResList.add(reviewCookyerRes);
            }
        }

        if(reviewCookyerResList.size() == 0){
            ReviewCookyerRes reviewCookyerRes = new ReviewCookyerRes();
            reviewCookyerRes.setStatusCode(HttpStatus.OK);
            reviewCookyerRes.setMessage("받은 리뷰가 없습니다.");
            reviewCookyerResList.add(reviewCookyerRes);
        }

        return reviewCookyerResList;
    }

    @Override
    public ReviewDetailRes getDetailReview(int reviewId) {
        // 존재하는 리뷰인지 확인
        Optional<Review> review = reviewRepository.findById(reviewId);
        if(review.isEmpty()){
            ReviewDetailRes reviewDetailRes = new ReviewDetailRes();
            reviewDetailRes.setStatusCode(HttpStatus.NOT_FOUND);
            reviewDetailRes.setMessage("존재하지 않는 리뷰입니다.");
            return reviewDetailRes;
        }

        ReviewDetailRes reviewDetailRes = new ReviewDetailRes(review.get());

        reviewDetailRes.setStatusCode(HttpStatus.OK);
        reviewDetailRes.setMessage("Success");

        return reviewDetailRes;
    }

    @Transactional
    @Override
    public ResponseDto modify(ReviewPutReq reviewPutReq) {
        // 존재하는 리뷰인지 확인
        Optional<Review> review = reviewRepository.findById(reviewPutReq.getReviewId());
        if(review.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 리뷰입니다.");
        }

        // 리뷰 작성자와 로그인한 사람이 동일한지 확인
        if(!review.get().getMember().getUserId().equals(reviewPutReq.getUserId())){
            return new ResponseDto(HttpStatus.FORBIDDEN, "작성한 Cookiee만 이용 가능합니다.");
        }

        // 받아온 값들로 변경해서 세팅 후 저장
        review.get().modify(reviewPutReq);
        reviewRepository.save(review.get());

        return new ResponseDto(HttpStatus.OK, "Success");
    }


    @Transactional
    @Override
    public ResponseDto delete(int reviewId, String loginId) {
        // 존재하는 리뷰인지 확인
        Optional<Review> review = reviewRepository.findById(reviewId);
        if(review.isEmpty()){
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 리뷰입니다.");
        }

        // 리뷰 작성자와 로그인한 사람이 동일한지 확인
        if(!review.get().getMember().getUserId().equals(loginId)){
            return new ResponseDto(HttpStatus.FORBIDDEN, "작성한 Cookiee만 이용 가능합니다.");
        }

        reviewRepository.deleteById(reviewId);
        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public ReviewAvgRes getReviewAvg(String cookyerId) {
        // 존재하는 cookyer인지 확인
        Optional<Member> member = memberRepository.findByUserId(cookyerId);
        if(member.isEmpty()){
            ReviewAvgRes reviewAvgRes = new ReviewAvgRes();
            reviewAvgRes.setStatusCode(HttpStatus.NOT_FOUND);
            reviewAvgRes.setMessage("존재하지 않는 Cookyer입니다.");
            return reviewAvgRes;
        }

        // cookyer인지 확인
        if(!member.get().getRole().equals(Role.COOKYER)){
            ReviewAvgRes reviewAvgRes = new ReviewAvgRes();
            reviewAvgRes.setStatusCode(HttpStatus.BAD_REQUEST);
            reviewAvgRes.setMessage("Cookyer가 아닙니다.");
            return reviewAvgRes;
        }

        // cookyer가 진행한 과외 목록 불러오기
        List<Lesson> lessonList = lessonRepository.findAllByCookyerId(cookyerId);
        float sum = 0; // 받은 리뷰 총합
        int count = 0; // 받은 리뷰 개수
        for (Lesson lesson : lessonList) {
            // 각 과외 별로 존재하는 리뷰 목록 불러오기
            List<Review> reviewList = reviewRepository.findAllByLesson_LessonId(lesson.getLessonId());
            for (Review review : reviewList) {
                sum += review.getRating();
                count++;
            }
        }

        ReviewAvgRes reviewAvgRes = new ReviewAvgRes();
        reviewAvgRes.setSum(sum);
        reviewAvgRes.setCount(count);
        if(count != 0){
            reviewAvgRes.setAvg(sum / count);
            reviewAvgRes.setStatusCode(HttpStatus.OK);
            reviewAvgRes.setMessage("Success");
        }else{
            reviewAvgRes.setAvg(0);
            reviewAvgRes.setStatusCode(HttpStatus.OK);
            reviewAvgRes.setMessage("받은 리뷰가 없습니다.");
        }

        return reviewAvgRes;
    }
}
