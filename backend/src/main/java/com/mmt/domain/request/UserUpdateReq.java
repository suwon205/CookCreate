package com.mmt.domain.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateReq {
    private String userPw;
    private String userPwCk;
    private String nickname;
    private int phoneNumber;
    private String userEmail;
    private String food;
    private String introduce;
    private String profileImg;
    private String introUrl;
}
