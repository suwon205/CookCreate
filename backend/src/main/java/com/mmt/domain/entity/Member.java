package com.mmt.domain.entity;

import com.mmt.domain.Role;
import com.mmt.domain.request.UserSignUpReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Member extends BaseTimeEntity {

    @Id
    private String userId;
    private String userPw;
    private String nickname;
    private int phoneNumber;
    private String userEmail;
    private String food;
    private Role role;
    private String introduce;
    private String profileImg;
    private String introUrl;

    public Member(UserSignUpReq userSignUpReq){
        this.userId = userSignUpReq.getUserId();
        this.userPw = userSignUpReq.getUserPw();
        this.nickname = userSignUpReq.getNickname();
        this.phoneNumber = userSignUpReq.getPhoneNumber();
        this.userEmail = userSignUpReq.getUserEmail();
        this.food = userSignUpReq.getFood();
        this.role = userSignUpReq.getRole();
    }
}
