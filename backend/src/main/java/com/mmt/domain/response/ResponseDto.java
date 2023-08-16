package com.mmt.domain.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
public class ResponseDto {
    private HttpStatus statusCode;
    private String message;

    public ResponseDto(HttpStatus statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
