package com.mmt.controller;

import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import com.mmt.domain.request.lesson.LessonSearchReq;
import com.mmt.domain.response.lesson.LessonDetailRes;
import com.mmt.domain.response.lesson.LessonLatestRes;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.lesson.LessonSearchRes;
import com.mmt.service.LessonService;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Tag(name = "과외 글 API", description = "과외 글 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/lesson")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;
    private final MemberService memberService;

    @Operation(summary = "과외 예약하기", description = "과외를 예약한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping(value = "")
    public ResponseEntity<ResponseDto> reserve(@ModelAttribute @Valid LessonPostReq lessonPostReq, BindingResult bindingResult, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        if(bindingResult.hasErrors()){ // valid error
            StringBuilder stringBuilder = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                stringBuilder.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(new ResponseDto(HttpStatus.BAD_REQUEST, stringBuilder.toString()), HttpStatus.BAD_REQUEST);
        }

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!memberService.getRole(loginId).equals(Role.COOKYER)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        lessonPostReq.setCookyerId(loginId);
        ResponseDto responseDto = lessonService.reserve(lessonPostReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 신청하기", description = "과외를 신청한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
    })
    @PostMapping("/{lessonId}")
    public ResponseEntity<ResponseDto> apply(@PathVariable(value = "lessonId") int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookiee만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        ResponseDto responseDto = lessonService.apply(lessonId, loginId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 수정하기", description = "예약한 과외를 수정한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "예약한 Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping(value = "")
    public ResponseEntity<ResponseDto> modifyLesson(@ModelAttribute @Valid LessonPutReq lessonPutReq, BindingResult bindingResult, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        if(bindingResult.hasErrors()){ // valid error
            StringBuilder stringBuilder = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                stringBuilder.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(new ResponseDto(HttpStatus.BAD_REQUEST, stringBuilder.toString()), HttpStatus.BAD_REQUEST);
        }

        LessonDetailRes lessonDetailRes = lessonService.getLessonDetail(Integer.parseInt(lessonPutReq.getLessonId()));
        if(lessonDetailRes == null){ // 존재 유무 확인
            return new ResponseEntity<>(new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다."), HttpStatus.NOT_FOUND);
        }

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!loginId.equals(lessonDetailRes.getCookyerId())){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "예약한 Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        lessonPutReq.setCookyerId(loginId);
        ResponseDto responseDto = lessonService.modifyLesson(lessonPutReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 삭제하기", description = "예약한 과외를 삭제한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "예약한 Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "과외를 신청한 Cookiee가 있어 삭제할 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ResponseDto> deleteLesson(@PathVariable(value = "lessonId") int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        LessonDetailRes lessonDetailRes = lessonService.getLessonDetail(lessonId);
        if(lessonDetailRes == null){ // 존재 유무 확인
            return new ResponseEntity<>(new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 과외입니다."), HttpStatus.NOT_FOUND);
        }

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!loginId.equals(lessonDetailRes.getCookyerId())){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "예약한 Cookyer만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        ResponseDto responseDto = lessonService.deleteLesson(lessonId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 신청 취소하기", description = "신청한 과외를 취소한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "신청한 Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 마감된/완료한 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @DeleteMapping("/cancel/{lessonId}")
    public ResponseEntity<ResponseDto> cancelLesson(@PathVariable(value = "lessonId") int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        ResponseDto responseDto = lessonService.cancelLesson(lessonId, loginId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "과외 검색하기", description = "과외 글 목록을 검색한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = LessonSearchRes.class))),
    })
    @GetMapping("")
    public ResponseEntity<List<LessonSearchRes>> getLessonList(@ModelAttribute LessonSearchReq lessonSearchReq){
        return new ResponseEntity<>(lessonService.getLessonList(lessonSearchReq), HttpStatus.OK);
    }

    @Operation(summary = "과외 상세보기", description = "과외 내용을 상세하게 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = LessonDetailRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = LessonDetailRes.class))),
    })
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDetailRes> getLessonDetail(@PathVariable(value = "lessonId") int lessonId, Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        return new ResponseEntity<>(lessonService.getLessonDetail(lessonId), HttpStatus.OK);
    }

    @Operation(summary = "과외 불러오기", description = "최근에 예약한 과외 내용을 불러온다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = LessonLatestRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = LessonLatestRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용 가능합니다",
                    content = @Content(schema = @Schema(implementation = LessonLatestRes.class))),
            @ApiResponse(responseCode = "404", description = "이전에 예약한 화상 과외 내역이 없습니다.",
                    content = @Content(schema = @Schema(implementation = LessonLatestRes.class))),
    })
    @GetMapping("/latest")
    public ResponseEntity<LessonLatestRes> getLessonLatest(Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        LessonLatestRes lessonLatestRes = new LessonLatestRes();
        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디

        if(!memberService.getRole(loginId).equals(Role.COOKYER)){ // 권한 에러
            lessonLatestRes.setStatusCode(HttpStatus.FORBIDDEN);
            lessonLatestRes.setMessage("Cookyer만 이용 가능합니다.");
            return new ResponseEntity<>(new LessonLatestRes(), lessonLatestRes.getStatusCode());
        }

        lessonLatestRes = lessonService.getLessonLatest(loginId);

        return new ResponseEntity<>(lessonLatestRes, lessonLatestRes.getStatusCode());
    }

    @Operation(summary = "선생님 뱃지 조회", description = "Cookyer의 뱃지가 승인됐는지 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "O/X",
                    content = @Content(schema = @Schema(implementation = LessonDetailRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = LessonDetailRes.class)))
    })
    @GetMapping("/badge/{cookyerId}")
    public ResponseEntity<ResponseDto> getHavingBadge(@PathVariable(value = "cookyerId") String cookyerId, Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        ResponseDto responseDto = lessonService.getHavingBadge(cookyerId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }
}
