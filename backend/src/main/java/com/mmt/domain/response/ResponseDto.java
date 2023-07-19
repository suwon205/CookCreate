package com.mmt.domain.response;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@NoArgsConstructor
public class ResponseDto {
    private int statusCode;
    private String message;

    public ResponseDto(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
