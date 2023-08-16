package com.mmt.domain.response.session;

import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SessionConnectRes extends ResponseDto {
    private String token;
}
