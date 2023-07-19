package com.mmt.controller;

import com.mmt.domain.TokenDto;
import com.mmt.domain.entity.Member;
import com.mmt.domain.request.UserLoginPostReq;
import com.mmt.domain.request.UserSignUpReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.repository.MemberRepository;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

@Tag(name = "인증 API", description = "인증 관련 API 입니다.")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;

    @Operation(summary = "회원 가입", description = "회원 가입한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "success",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "400", description = "bad request operation",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @PostMapping("/signup")
    public ResponseDto signup(@RequestBody UserSignUpReq userSignUpReq) throws Exception {
        return memberService.signUp(userSignUpReq);
    }

    @Operation(summary = "로그인", description = "<b>아이디와 비밀번호</b>를 입력해 로그인 한다..")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "401", description = "UNAUTHORIZED",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @PostMapping("/login")
    public ResponseDto login(@RequestBody UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        return memberService.login(userLoginPostReq, response);
    }

    @Operation(summary = "로그아웃", description = "<b>로그인 상태인 사용자</b>는 로그아웃 할 수 있다.")

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "401", description = "UNAUTHORIZED",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @PostMapping("/logout")
    public ResponseDto login(HttpServletRequest request, HttpServletResponse response) {
        return memberService.logout(request, response);
    }
}
