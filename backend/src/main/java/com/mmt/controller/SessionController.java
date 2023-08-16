package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.request.session.SessionPostReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.session.SessionConnectRes;
import com.mmt.service.LessonService;
import io.openvidu.java.client.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;

@Tag(name = "과외 세션 API", description = "과외 세션 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/session")
@RequiredArgsConstructor
public class SessionController {

//    // openvidu 프론트에서 처리하는 걸로 수정
//    @Value("${OPENVIDU_URL}")
//    private String OPENVIDU_URL;

//    @Value("${OPENVIDU_SECRET}")
//    private String OPENVIDU_SECRET;

    private final LessonService lessonService;

//    private OpenVidu openvidu;

//    @PostConstruct
//    public void init() {
//        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
//    }

    @Operation(summary = "과외 세션 생성", description = "선생님이 과외 세션을 생성한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "과외를 신청한 회원만 참가할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다./아직 방이 생성되지 않았습니다.",
            content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 종료된 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/create")
    public ResponseEntity<? extends ResponseDto> initializeSession(@RequestBody SessionPostReq sessionPostReq, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication : " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername();
        sessionPostReq.setUserId(loginId);
        String customSessionId = lessonService.getSessionId(sessionPostReq.getLessonId());
        SessionConnectRes sessionConnectRes = new SessionConnectRes();
        if(userDetails.getMember().getRole().equals(Role.COOKYER)){ // 쿠커면 db 확인해서 customid 생성
            if(customSessionId == null){
                customSessionId = RandomStringUtils.randomAlphanumeric(15);
                // 생성한 customSessionId db에 저장 -> 유효성 검사 같이 진행
            }
            sessionPostReq.setSessionId(customSessionId);
            ResponseDto responseDto = lessonService.createSession(sessionPostReq);

            sessionConnectRes.setToken(customSessionId);
            sessionConnectRes.setStatusCode(responseDto.getStatusCode());
            sessionConnectRes.setMessage(responseDto.getMessage());
        }else{ // 쿠키면 db 확인해서 에러 혹은 생성
            if(customSessionId == null) {
                // 아직 방이 생성 안됨 -> 에러 반환
                return new ResponseEntity<>(new ResponseDto(HttpStatus.NOT_FOUND, "아직 방이 생성되지 않았습니다."), HttpStatus.NOT_FOUND);
            }
            // 해당 쿠키의 유효성 검사 진행
            sessionPostReq.setSessionId(customSessionId);
            ResponseDto responseDto = lessonService.checkSession(sessionPostReq);

            sessionConnectRes.setToken(customSessionId);
            sessionConnectRes.setStatusCode(responseDto.getStatusCode());
            sessionConnectRes.setMessage(responseDto.getMessage());
        }
        return new ResponseEntity<>(sessionConnectRes, sessionConnectRes.getStatusCode());

//        SessionProperties props = new SessionProperties.Builder().customSessionId(customSessionId).build();
//        Session session = null;
//        try {
//            session = this.openvidu.createSession(props);
//        } catch (OpenViduHttpException e) {
//            if ((e.getStatus() >= 500 && e.getStatus() <= 504) || e.getStatus() == 404) {
//                log.warn("The node handling the createSession operation is crashed ({}: {}). Retry", e.getStatus(),
//                        e.getMessage());
//                try {
//                    Thread.sleep(100);
//                } catch (InterruptedException e1) {
//                }
//                return getErrorResponse(e);
//            } else {
//                log.error("Unexpected error while creating session: {}", e.getMessage());
//                return getErrorResponse(e);
//            }
//        } catch (OpenViduJavaClientException e) {
//            log.error("Unexpected internal error while creating session. {}: {}", e.getClass().getCanonicalName(),
//                    e.getMessage());
//            return getErrorResponse(e);
//        }
//        return returnToken(session);
    }

    private ResponseEntity<? extends ResponseDto> returnToken (Session session){
        try {
            String token = session.createConnection().getToken();

            SessionConnectRes sessionConnectRes = new SessionConnectRes();
            sessionConnectRes.setToken(token);
            sessionConnectRes.setStatusCode(HttpStatus.OK);
            sessionConnectRes.setMessage("Success");
            return new ResponseEntity<>(sessionConnectRes, HttpStatus.OK);
        } catch (OpenViduJavaClientException e1) {
            // If internal error generate an error message and return it to client
            log.error("Unexpected internal error while creating connection: {}", e1.getMessage());
            return getErrorResponse(e1);
        } catch (OpenViduHttpException e2) {
            if (404 == e2.getStatus()) {
                // The session wasn't found in OpenVidu Server
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            if (e2.getStatus() >= 500 && e2.getStatus() <= 504) {
                log.warn("The node handling the createConnection operation is crashed ({}: {}). Retry", e2.getStatus(),
                        e2.getMessage());
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e1) {
                }
                return returnToken(session);
            }
            return getErrorResponse(e2);
        }
    }

    private ResponseEntity<ResponseDto> getErrorResponse(Exception e) {
        ResponseDto responseDto = new ResponseDto();
        responseDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);

        StringBuilder sb = new StringBuilder();
        if (e.getCause() != null) {
            sb.append("cause" + e.getCause().toString()+"\n");
        }
        if (e.getStackTrace() != null) {
            sb.append("stacktrace" + e.getStackTrace().toString()+"\n");
        }
        sb.append("error" + e.getMessage().toString()+"\n");
        sb.append("exception" + e.getClass().getCanonicalName().toString()+"\n");
        responseDto.setMessage(sb.toString());

        return new ResponseEntity<>(responseDto, HttpStatus.INTERNAL_SERVER_ERROR);
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
