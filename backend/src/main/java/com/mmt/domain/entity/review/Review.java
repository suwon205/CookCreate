package com.mmt.domain.entity.review;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.Auth.Member;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.request.review.ReviewPostReq;
import com.mmt.domain.request.review.ReviewPutReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@DynamicUpdate // 변경된 컬럼만 찾아서 변경
public class Review extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private float rating;
    private String reviewContents;

    public Review(ReviewPostReq reviewPostReq){
        this.rating = reviewPostReq.getRating();
        this.reviewContents = reviewPostReq.getReviewContents();
    }

    public void modify(ReviewPutReq reviewPutReq){
        this.reviewId = reviewPutReq.getReviewId();
        this.rating = reviewPutReq.getRating();
        this.reviewContents = reviewPutReq.getReviewContents();
    }
}
