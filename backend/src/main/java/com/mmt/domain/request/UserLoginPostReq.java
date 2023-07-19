package com.mmt.domain.request;

import lombok.Data;

@Data
public class UserLoginPostReq {
    private String userId;
    private String userPw;
}
