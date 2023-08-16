package com.mmt.domain.response.review;

import com.mmt.domain.entity.review.Review;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewCookyerRes extends ResponseDto {
    private int reviewId;
    private String userId;
    private String nickname;
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    private String cookyerName;
    private float rating;
    private String reviewContents;

    public ReviewCookyerRes(Review review){
        this.reviewId = review.getReviewId();
        this.userId = review.getMember().getUserId();
        this.nickname = review.getMember().getNickname();
        this.lessonId = review.getLesson().getLessonId();
        this.lessonTitle = review.getLesson().getLessonTitle();
        this.cookyerId = review.getLesson().getCookyerId();
        this.cookyerName = review.getLesson().getCookyerName();
        this.rating = review.getRating();
        this.reviewContents = review.getReviewContents();
    }
}
