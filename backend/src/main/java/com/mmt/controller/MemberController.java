package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.request.auth.UserUpdateReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.auth.UserInfoRes;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@Tag(name = "멤버 API", description = "멤버 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "회원 정보 조회", description = "<b>로그인한 회원 정보를 조회</b>한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class))),
            @ApiResponse(responseCode = "403", description = "권한이 없습니다.",
                    content = @Content(schema = @Schema(implementation = UserInfoRes.class)))
    })
    @GetMapping()
    public ResponseEntity<? extends ResponseDto> getUserInfo(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        log.debug("userId: " + userId);

        UserInfoRes userInfoRes = memberService.getUserInfo(userId);

        if(userInfoRes == null) {
            ResponseDto responseDto = new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다");
            return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
        } else {
            userInfoRes.setStatusCode(HttpStatus.OK);
            userInfoRes.setMessage("success");
        }

        return new ResponseEntity<>(userInfoRes, userInfoRes.getStatusCode());
    }

    @Operation(summary = "회원 정보 수정", description = "<b>로그인한 회원 정보를 수정</b>한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "권한이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping(value = "")
    public ResponseEntity<ResponseDto> updateUserInfo(@ModelAttribute UserUpdateReq userUpdateReq, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        log.info(userUpdateReq.getFood());

        userUpdateReq.setUserId(userId);
        ResponseDto responseDto = memberService.updateUserInfo(userUpdateReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());

    }

    @Operation(summary = "로그아웃", description = "<b>로그인 상태인 사용자가 로그아웃</b>한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/logout")
    public ResponseEntity<ResponseDto> logout(HttpServletRequest request, HttpServletResponse response) {
        ResponseDto responseDto = memberService.logout(request, response);
        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

}
