package com.mmt.domain.response.review;

import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewAvgRes extends ResponseDto {
    private float avg;
    private int count; // 리뷰 개수
    private float sum; // 리뷰 총합
}
