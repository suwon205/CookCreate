package com.mmt.domain.request;

import lombok.*;

@Getter
@NoArgsConstructor
public class UserSignUpReq {
    private String userId;
    private String userPw;
    private String userPwCk; // 패스워드 확인을 위한 필드

    public UserSignUpReq(String userId, String userPw, String userPwCk){
        this.userId = userId;
        this.userPw = userPw;
        this.userPwCk = userPwCk;
    }

    public void setEncodePw(String encodePw){
        this.userPw = encodePw;
    }
}
