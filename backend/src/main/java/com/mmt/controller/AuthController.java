package com.mmt.controller;

import com.mmt.domain.TokenDto;
import com.mmt.domain.request.auth.UserLoginPostReq;
import com.mmt.domain.request.auth.UserSignUpReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.auth.UserLoginRes;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

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
            @ApiResponse(responseCode = "400", description = "형식이 맞지 않습니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
    })
    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(@RequestBody @Valid UserSignUpReq userSignUpReq, BindingResult bindingResult){
        ResponseDto responseDto = new ResponseDto();

        if(bindingResult.hasErrors()){
            StringBuilder stringBuilder = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                stringBuilder.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(new ResponseDto(HttpStatus.BAD_REQUEST, stringBuilder.toString()), HttpStatus.BAD_REQUEST);
        }

        try{
            responseDto = memberService.signUp(userSignUpReq);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "로그인", description = "<b>아이디와 비밀번호</b>를 입력해 로그인 한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "401", description = "비밀번호를 확인해주세요.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<UserLoginRes> login(@RequestBody UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        UserLoginRes userLoginRes = memberService.login(userLoginPostReq, response);
        return new ResponseEntity<>(userLoginRes, userLoginRes.getStatusCode());
    }

    @Operation(summary = "refresh token 재발행", description = "refresh token을 재발행한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "401", description = "비밀번호를 확인해주세요.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 계정입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @PostMapping("/regenerateToken")
    public ResponseEntity<UserLoginRes> regenerateToken(@RequestBody TokenDto tokenDto, HttpServletResponse response) {
        UserLoginRes userLoginRes = memberService.regenerateToken(tokenDto, response);
        return new ResponseEntity<>(userLoginRes, userLoginRes.getStatusCode());
    }

    @Operation(summary = "아이디 중복 체크", description = "존재하는 아이디인지 확인한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용 가능한 ID입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 사용자 ID입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @GetMapping("/checkId/{userId}")
    public ResponseEntity<ResponseDto> checkUserId(@PathVariable("userId") String userId) {
        ResponseDto responseDto = memberService.checkUserId(userId);
        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "닉네임 중복 체크", description = "존재하는 닉네임인지 확인한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용 가능한 닉네임입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class))),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 닉네임입니다.",
                    content = @Content(schema = @Schema(implementation = UserSignUpReq.class)))
    })
    @GetMapping("/checkNick/{nickname}")
    public ResponseEntity<ResponseDto> checkNickname(@PathVariable("nickname") String nickname) {
        ResponseDto responseDto = memberService.checkNickname(nickname);
        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }
}
