package com.mmt.domain.request.auth;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class UserUpdateReq {
//    private String userPw;
//    private String userPwCk;
    private String userId;
    private String nickname;
    private String phoneNumber;
    private String userEmail;
    private String food;
    private String introduce;
    private MultipartFile profileImg;
    private String introUrl;

//    public void setEncodePw(String encodePw){
//        this.userPw = encodePw;
//    }
}
