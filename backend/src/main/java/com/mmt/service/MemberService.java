package com.mmt.service;

import com.mmt.domain.TokenDto;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.request.auth.UserLoginPostReq;
import com.mmt.domain.request.auth.UserSignUpReq;
import com.mmt.domain.request.auth.UserUpdateReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.auth.UserInfoRes;
import com.mmt.domain.response.auth.UserLoginRes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface MemberService {

    // 회원가입
    public ResponseDto signUp(UserSignUpReq userSignUpReq) throws Exception;
    public UserLoginRes login(UserLoginPostReq userLoginPostReq, HttpServletResponse response);
    public UserLoginRes regenerateToken(TokenDto tokenDto, HttpServletResponse response);

    public ResponseDto logout(HttpServletRequest request, HttpServletResponse response);
    public UserInfoRes getUserInfo(String userId);
    public ResponseDto updateUserInfo(UserUpdateReq userUpdateReq);
    public ResponseDto deleteUser(String userId);

    public ResponseDto checkUserId(String userId);
    public ResponseDto checkNickname(String nickname);

    public Role getRole(String userID);
}
