package com.mmt.domain.response.my;

import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.entity.pay.PaymentHistory;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
public class MyPaymentRes extends ResponseDto {
    private String userId;
    private int lessonId;
    private String lessonTitle;
    private int totalAmount;
    private PayStatus payStatus;
    private String approvedAt;
    private String canceledAt;

    public MyPaymentRes(PaymentHistory paymentHistory) {
        this.userId = paymentHistory.getMember().getUserId();
        this.lessonId = paymentHistory.getLesson().getLessonId();
        this.lessonTitle = paymentHistory.getLesson().getLessonTitle();
        this.totalAmount = paymentHistory.getTotalAmount();
        this.payStatus = paymentHistory.getPayStatus();
    }

    public MyPaymentRes(HttpStatus httpStatus, String message) {
        this.setStatusCode(httpStatus);
        this.setMessage(message);
    }
}
