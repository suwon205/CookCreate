package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.request.session.SessionPostReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.session.SessionConnectRes;
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
import org.checkerframework.checker.nullness.Opt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;


import io.openvidu.java.client.Connection;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;

import java.util.Optional;


@Tag(name = "과외 세션 API", description = "과외 세션 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/session")
@RequiredArgsConstructor
public class SessionController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private final LessonService lessonService;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @Operation(summary = "과외 세션 생성", description = "선생님이 과외 세션을 생성한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 과외 방을 생성할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
            content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 세션이 할당되어 있습니다./이미 종료된 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/create")
    public ResponseEntity<? extends ResponseDto> initializeSession(@RequestBody SessionPostReq sessionPostReq, Authentication authentication) throws OpenViduJavaClientException, OpenViduHttpException {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        sessionPostReq.setUserId(loginId);

        Session session = openvidu.createSession();
        sessionPostReq.setSessionId(session.getSessionId());
        log.info(sessionPostReq.toString());

        // db에 세션아이디 저장
        ResponseDto responseDto = lessonService.createSession(sessionPostReq);

        // 바로 connect
        Connection connection = session.createConnection();
        SessionConnectRes sessionConnectRes = new SessionConnectRes();
        sessionConnectRes.setToken(connection.getToken());
        sessionConnectRes.setStatusCode(responseDto.getStatusCode());
        sessionConnectRes.setMessage(responseDto.getMessage());

        return new ResponseEntity<>(sessionConnectRes, sessionConnectRes.getStatusCode());
    }

    @Operation(summary = "과외 세션 입장", description = "과외 세션에 입장한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "해당 과외를 신청한 사람만 입장할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 종료된 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/connect")
    public ResponseEntity<? extends ResponseDto> createConnection (@RequestBody SessionPostReq sessionPostReq, Authentication authentication) throws OpenViduJavaClientException, OpenViduHttpException{
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        sessionPostReq.setUserId(loginId);

        // 서비스에서는 유효성 검사만 진행
        ResponseDto responseDto = lessonService.createConnection(sessionPostReq);

        if(!responseDto.getStatusCode().equals(HttpStatus.OK)){
            return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
        }

        String sessionId= lessonService.getSessionId(sessionPostReq.getLessonId());
        log.info(sessionId);
        Session session = openvidu.getActiveSession(sessionId);
        if(session == null){
            return new ResponseEntity<>(new ResponseDto(HttpStatus.NOT_FOUND, "활성화된 세션이 없습니다."), HttpStatus.NOT_FOUND);
        }
        Connection connection = session.createConnection();
        SessionConnectRes sessionConnectRes = new SessionConnectRes();
        sessionConnectRes.setToken(connection.getToken());
        sessionConnectRes.setStatusCode(responseDto.getStatusCode());
        sessionConnectRes.setMessage(responseDto.getMessage());

        return new ResponseEntity<>(sessionConnectRes, sessionConnectRes.getStatusCode());
    }

    @Operation(summary = "과외 세션 닫기", description = "과외 세션을 종료한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "과외를 예약한 Cookyer만 종료할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "생성된 세션이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 종료된 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @DeleteMapping("")
    public ResponseEntity<ResponseDto> deleteSession(@RequestBody SessionPostReq sessionPostReq, Authentication authentication) throws OpenViduJavaClientException, OpenViduHttpException {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        sessionPostReq.setUserId(loginId);
        log.info(sessionPostReq.toString());

        // front에서 처리하는 걸로 수정
//        String sessionId = lessonService.getSessionId(sessionPostReq.getLessonId());
//        Session session = openvidu.getActiveSession(sessionId);
//        session.close();

        ResponseDto responseDto = lessonService.deleteSession(sessionPostReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }
}
