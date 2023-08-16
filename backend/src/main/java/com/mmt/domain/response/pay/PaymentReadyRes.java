package com.mmt.domain.response.pay;

import com.mmt.domain.response.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReadyRes extends ResponseDto {
    private String tid;
    private String next_redirect_pc_url;
    private LocalDateTime created_at;

    public PaymentReadyRes(HttpStatus httpStatus, String message) {
        this.setStatusCode(httpStatus);
        this.setMessage(message);
    }
}
