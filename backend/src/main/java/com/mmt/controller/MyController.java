package com.mmt.controller;

import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.my.*;
import com.mmt.service.MemberService;
import com.mmt.service.MyService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "마이페이지 API", description = "마이페이지 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class MyController {

    private final MyService myService;
    private final MemberService memberService;

    @Operation(summary = "신청한 과외 목록 조회", description = "신청한 과외 목록을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = MyLessonRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = MyLessonRes.class)))
    })
    @GetMapping("/applied")
    public ResponseEntity<List<MyLessonRes>> getLessonApplied(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        List<MyLessonRes> myLessonAppliedList = myService.getMyLesson(userDetails.getUsername(), false);

        return new ResponseEntity<>(myLessonAppliedList, myLessonAppliedList.get(0).getStatusCode());
    }

    @Operation(summary = "완료한 과외 목록 조회", description = "완료한 과외 목록을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = MyLessonRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = MyLessonRes.class)))
    })
    @GetMapping("/completed")
    public ResponseEntity<List<MyLessonRes>> getLessonCompleted(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        List<MyLessonRes> myLessonCompletedList = myService.getMyLesson(userDetails.getUsername(), true);

        return new ResponseEntity<>(myLessonCompletedList, myLessonCompletedList.get(0).getStatusCode());
    }

    @Operation(summary = "획득한 레시피북 조회", description = "획득한 레시피북을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = MyRecipeRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = MyRecipeRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookiee만 이용할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = MyRecipeRes.class)))
    })
    @GetMapping("/recipe")
    public ResponseEntity<List<MyRecipeRes>> getMyRecipe(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        String loginId = userDetails.getUsername();
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            MyRecipeRes myRecipeRes = new MyRecipeRes();
            myRecipeRes.setStatusCode(HttpStatus.FORBIDDEN);
            myRecipeRes.setMessage("Cookiee만 이용할 수 있습니다.");
            List<MyRecipeRes> myRecipeResList = new ArrayList<>();
            myRecipeResList.add(myRecipeRes);
            return new ResponseEntity<>(myRecipeResList, HttpStatus.FORBIDDEN);
        }

        List<MyRecipeRes> myRecipeResList = myService.getMyRecipe(loginId);

        return new ResponseEntity<>(myRecipeResList, myRecipeResList.get(0).getStatusCode());
    }

    @Operation(summary = "작성한 리뷰 목록 조회", description = "작성한 리뷰 목록을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = MyReviewRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = MyReviewRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookiee만 이용할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = MyReviewRes.class)))
    })
    @GetMapping("/review")
    public ResponseEntity<List<MyReviewRes>> getMyReview(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        String loginId = userDetails.getUsername();
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            MyReviewRes myReviewRes = new MyReviewRes();
            myReviewRes.setStatusCode(HttpStatus.FORBIDDEN);
            myReviewRes.setMessage("Cookiee만 이용할 수 있습니다.");
            List<MyReviewRes> myReviewResList = new ArrayList<>();
            myReviewResList.add(myReviewRes);
            return new ResponseEntity<>(myReviewResList, HttpStatus.FORBIDDEN);
        }

        List<MyReviewRes> myReviewResList = myService.getMyReview(loginId);

        return new ResponseEntity<>(myReviewResList, myReviewResList.get(0).getStatusCode());
    }

    @Operation(summary = "자격증 등록", description = "자격증을 등록한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 이용할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/badge")
    public ResponseEntity<ResponseDto> registerLicense(@RequestPart(value = "capture") MultipartFile multipartFile, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        ResponseDto responseDto = myService.registerLicense(userDetails.getUsername(), multipartFile);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "자격증 목록", description = "등록한 자격증 목록을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = MyBadgeRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = MyBadgeRes.class))),
            @ApiResponse(responseCode = "403", description = "Cookyer만 확인할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = MyBadgeRes.class))),
            @ApiResponse(responseCode = "404", description = "등록한 자격증이 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = MyBadgeRes.class)))
    })
    @GetMapping("/badge")
    public ResponseEntity<List<MyBadgeRes>> getLicenseList(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        List<MyBadgeRes> myBadgeResList = myService.getLicenseList(userDetails.getUsername());

        return new ResponseEntity<>(myBadgeResList, myBadgeResList.get(0).getStatusCode());
    }

    @Operation(summary = "프로필 이미지 삭제", description = "자신의 프로필 이미지 삭제한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "등록한 프로필 사진이 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @DeleteMapping("/profile")
    public ResponseEntity<ResponseDto> deleteProfileImg(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (authentication.getPrincipal()));

        ResponseDto responseDto = myService.deleteProfileImg(userDetails.getUsername());

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "결제 내역 보기", description = "학생 회원이 자신의 결제 내역을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "200", description = "결제 내역이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping("/cookiee")
    public ResponseEntity<List<MyPaymentRes>> getCookieePaymentHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        List<MyPaymentRes> result = myService.getCookieePayment(userId);

        return new ResponseEntity<>(result, result.get(0).getStatusCode());
    }

    @Operation(summary = "정산 내역 보기", description = "선생님 회원이 자신의 정산 내역을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "200", description = "정산 내역이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping("/cookyer")
    public ResponseEntity<List<MyPaymentRes>> getCookyerPaymentHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        List<MyPaymentRes> result = myService.getCookyerPayment(userId);

        return new ResponseEntity<>(result, result.get(0).getStatusCode());
    }
}
