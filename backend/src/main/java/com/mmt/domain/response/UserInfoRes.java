package com.mmt.domain.response;

import com.mmt.domain.Role;
import com.mmt.domain.entity.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoRes {
    String userId;
    String nickname;
    int phoneNumber;
    String userEmail;
    String food;
    Role role;
    String introduce;
    String profileImg;
    String introUrl;
    String createdDate;

    public UserInfoRes(Member member) {
        this.userId = member.getUserId();
        this.nickname = member.getNickname();
    }
}