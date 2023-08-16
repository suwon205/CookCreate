package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.request.review.ReviewPostReq;
import com.mmt.domain.request.review.ReviewPutReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.review.ReviewAvgRes;
import com.mmt.domain.response.review.ReviewCookyerRes;
import com.mmt.domain.response.review.ReviewDetailRes;
import com.mmt.service.MemberService;
import com.mmt.service.ReviewService;
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

@Tag(name = "리뷰 API", description = "리뷰 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final MemberService memberService;

    @Operation(summary = "리뷰 등록하기", description = "리뷰를 등록한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "수강한 Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 과외입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("")
    public ResponseEntity<ResponseDto> register(@RequestBody @Valid ReviewPostReq reviewPostReq, BindingResult bindingResult, Authentication authentication) {
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
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyiee만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        reviewPostReq.setUserId(loginId);
        ResponseDto responseDto = reviewService.register(reviewPostReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "Cookyer가 받은 리뷰 목록 조회", description = "Cookyer가 받은 리뷰 목록을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 Cookyer입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping("/{cookyerId}")
    public ResponseEntity<List<ReviewCookyerRes>> getDetailReview(@PathVariable(value = "cookyerId") String cookyerId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        List<ReviewCookyerRes> reviewCookyerRes = reviewService.getCookyerReview(cookyerId);

        return new ResponseEntity<>(reviewCookyerRes, reviewCookyerRes.get(0).getStatusCode());
    }

    @Operation(summary = "리뷰 상세보기", description = "리뷰를 상세하게 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ReviewDetailRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ReviewDetailRes.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 리뷰입니다.",
                    content = @Content(schema = @Schema(implementation = ReviewDetailRes.class)))
    })
    @GetMapping("/detail/{reviewId}")
    public ResponseEntity<ReviewDetailRes> getDetailReview(@PathVariable(value = "reviewId") int reviewId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        ReviewDetailRes reviewDetailRes = reviewService.getDetailReview(reviewId);

        return new ResponseEntity<>(reviewDetailRes, reviewDetailRes.getStatusCode());
    }

    @Operation(summary = "리뷰 수정하기", description = "리뷰를 수정한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "형식을 맞춰주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "작성한 Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 리뷰입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("")
    public ResponseEntity<ResponseDto> modify(@RequestBody @Valid ReviewPutReq reviewPutReq, BindingResult bindingResult, Authentication authentication) {
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
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyiee만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        reviewPutReq.setUserId(loginId);
        ResponseDto responseDto = reviewService.modify(reviewPutReq);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "리뷰 삭제하기", description = "리뷰를 삭제한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "작성한 Cookiee만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 리뷰입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ResponseDto> delete(@PathVariable(value = "reviewId") int reviewId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        String loginId = userDetails.getUsername(); // 현재 로그인한 아이디
        if(!memberService.getRole(loginId).equals(Role.COOKIEE)){ // 권한 에러
            return new ResponseEntity<>(new ResponseDto(HttpStatus.FORBIDDEN, "Cookyiee만 이용 가능합니다."), HttpStatus.FORBIDDEN);
        }

        ResponseDto responseDto = reviewService.delete(reviewId, loginId);

        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }

    @Operation(summary = "리뷰 평점 평균 가져오기", description = "선생님이 받은 평점의 평균을 조회한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ReviewAvgRes.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ReviewAvgRes.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 리뷰입니다.",
                    content = @Content(schema = @Schema(implementation = ReviewAvgRes.class)))
    })
    @GetMapping("/avg/{cookyerId}")
    public ResponseEntity<ReviewAvgRes> getReviewAvg(@PathVariable(value = "cookyerId") String cookyerId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        log.debug("authentication: " + (userDetails.getUsername()));

        ReviewAvgRes reviewAvgRes = reviewService.getReviewAvg(cookyerId);

        return new ResponseEntity<>(reviewAvgRes, reviewAvgRes.getStatusCode());
    }
}
