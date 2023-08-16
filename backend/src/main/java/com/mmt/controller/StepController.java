package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.request.lesson.LessonStepPutReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.lesson.LessonDetailRes;
import com.mmt.domain.response.lesson.LessonStepRes;
import com.mmt.service.LessonService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "과외 진행단계 API", description = "WebRTC 도중 과외 진행단계 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/step")
@RequiredArgsConstructor
public class StepController {

    private final LessonService lessonService;

    @Operation(summary = "과외 진행단계 불러오기", description = "과외 방을 들어갈 때 해당 과외의 요리 단계를 불러온다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = LessonStepRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = LessonStepRes.class))),
    })
    @GetMapping("/{lessonId}")
    public ResponseEntity<List<LessonStepRes>> getLessonStep(@PathVariable(value = "lessonId") int lessonId, Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        LessonDetailRes lessonDetailRes = lessonService.getLessonDetail(lessonId);
        if(lessonDetailRes == null){ // 존재 유무 확인
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(lessonService.getLessonStep(lessonId), HttpStatus.OK);
    }

    @Operation(summary = "과외 진행단계 수정하기", description = "과외의 진행단계를 수정한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "해당 과외의 Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("")
    public ResponseEntity<ResponseDto> modifyLessonStep(@RequestBody LessonStepPutReq lessonStepPutReq, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        ResponseDto responseDto = lessonService.modifyLessonStep(loginId, lessonStepPutReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

}
