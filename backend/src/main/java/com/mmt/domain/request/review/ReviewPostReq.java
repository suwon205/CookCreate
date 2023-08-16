package com.mmt.domain.request.review;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class ReviewPostReq {
    private String userId;
    @NotNull(message = "과외 ID는 필수 입력값입니다.")
    private int lessonId;
    @NotNull(message = "평점은 필수 입력값입니다.")
    @Min(value = 0, message = "평점은 0점 이상으로 작성해주세요.")
    @Max(value = 5, message = "평점은 5점 이하로 작성해주세요.")
    private float rating;
    @Length(max = 100, message = "100자 이내로 작성해주세요.")
    private String reviewContents;
}
