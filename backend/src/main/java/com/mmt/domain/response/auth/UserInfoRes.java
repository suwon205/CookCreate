package com.mmt.domain.response.auth;

import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.response.ResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserInfoRes extends ResponseDto {
    String userId;
    String nickname;
    String phoneNumber;
    String userEmail;
    List<Integer> food;
    Role role;
    String introduce;
    String profileImg;
    LocalDateTime createdDate;

    public UserInfoRes(Member member) {
        this.userId = member.getUserId();
        this.nickname = member.getNickname();
        this.phoneNumber = member.getPhoneNumber();
        this.userEmail = member.getUserEmail();
        if(member.getFood() != null){
            this.food = Arrays.asList(member.getFood().split(","))
                    .stream()
                    .map(s -> Integer.parseInt(s))
                    .collect(Collectors.toList());
        }
        this.role = member.getRole();
        this.introduce = member.getIntroduce();
        this.profileImg = member.getProfileImg();
        this.createdDate = member.getCreatedDate();
    }
}