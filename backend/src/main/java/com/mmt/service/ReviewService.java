package com.mmt.service;

import com.mmt.domain.request.review.ReviewPostReq;
import com.mmt.domain.request.review.ReviewPutReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.review.ReviewAvgRes;
import com.mmt.domain.response.review.ReviewCookyerRes;
import com.mmt.domain.response.review.ReviewDetailRes;

import java.util.List;

public interface ReviewService {
    ResponseDto register(ReviewPostReq reviewPostReq);
    List<ReviewCookyerRes> getCookyerReview(String cookyerId);
    ReviewDetailRes getDetailReview(int reviewId);
    ResponseDto modify(ReviewPutReq reviewPutReq);
    ResponseDto delete(int reviewId, String loginId);
    ReviewAvgRes getReviewAvg(String cookyerId);
}
