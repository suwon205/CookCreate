package com.mmt.domain.entity.Auth;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.request.auth.UserSignUpReq;
import com.mmt.domain.request.auth.UserUpdateReq;
import com.mmt.domain.entity.auth.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Member extends BaseTimeEntity {

    @Id
    private String userId;
    private String userPw;
    private String nickname;
    private String phoneNumber;
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

    public void update(UserUpdateReq userUpdateReq){
//        this.userPw = userUpdateReq.getUserPw();
        this.nickname = userUpdateReq.getNickname();
        this.phoneNumber = userUpdateReq.getPhoneNumber();
        this.userEmail = userUpdateReq.getUserEmail();
        this.food = userUpdateReq.getFood();
        this.introduce = userUpdateReq.getIntroduce();
    }
}
