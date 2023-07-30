package com.mmt.controller;

import com.mmt.domain.entity.Auth.Member;
import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.request.session.SessionCreateReq;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.auth.UserInfoRes;
import com.mmt.domain.response.session.SessionJoinRes;
import com.mmt.service.LessonService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isBlank;

@Tag(name = "과외 세션 API", description = "과외 세션 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/session")
@RequiredArgsConstructor
public class SessionController {
    private final LessonService lessonService;
    private final MemberService memberService;

    @Operation(summary = "과외 세션 생성", description = "과외 세션을 생성한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이 cookyer에게는 이미 세션이 할당 되있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("/{lessonId}")
    public ResponseEntity<ResponseDto> create(
            @Parameter(description = "레슨 id") @PathVariable int lessonId,
            @RequestBody SessionCreateReq sessionCreateReq, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        if(!memberService.getRole(loginId).equals(Role.COOKYER)){
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        if(!isBlank(lessonService.getLessonDetail(lessonId).getSessionId())) {
            return new ResponseEntity<>(new ResponseDto(HttpStatus.CONFLICT, "이 cookyer에게는 이미 세션이 할당 되있습니다."), HttpStatus.CONFLICT);
        }

        ResponseDto responseDto = lessonService.createSession(lessonId, sessionCreateReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 세션 입장", description = "과외 세션에 입장한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "강의 수강 신청을 하지 않았습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping("/{lessonId}")
    public ResponseEntity<? extends ResponseDto> join (
            @Parameter(description = "레슨 id") @PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)) {
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookiee만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        List<Member> participants = lessonService.getLessonDetail(lessonId).getLessonParticipantList();
        boolean isReserved = false; // 이 쿠키가 예약했으면 true, 아니면 false
        for (Member participant : participants) {
            if (participant.getUserId() == loginId) {
                isReserved = true;
            }
        }

        if(isReserved == false) {
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "강의 수강신청을 하지 않았습니다."), HttpStatus.FORBIDDEN);
        }

        SessionJoinRes sessionJoinRes = new SessionJoinRes();
        sessionJoinRes.setSessionId(lessonService.getLessonDetail(lessonId).getSessionId());

        return new ResponseEntity<>(sessionJoinRes, sessionJoinRes.getStatusCode());
    }

    @Operation(summary = "과외 세션 닫기", description = "과외 세션을 종료한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "과외를 개설한 선생님만 닫을 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "개설한 세션이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("/shutdown/{lessonId}")
    public ResponseEntity<ResponseDto> shutdown(
            @Parameter(description = "레슨 id") @PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();

        // 역할이 Cookyer이고, 과외의 cookyer id가 userId와 같음을 동시에 충족해야함
        if(!memberService.getRole(loginId).equals(Role.COOKYER) && loginId != lessonService.getLessonDetail(lessonId).getCookyerId()){
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "과외를 개설한 cookyer만 개설한 세션을 닫을 수 있습니다."), HttpStatus.FORBIDDEN);
        }

        if(isBlank(lessonService.getLessonDetail(lessonId).getSessionId())) {
            return new ResponseEntity<>(new ResponseDto(HttpStatus.CONFLICT, "개설한 세션이 없습니다."), HttpStatus.CONFLICT);
        }

        ResponseDto responseDto = lessonService.shutdownSession(lessonId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }
}
