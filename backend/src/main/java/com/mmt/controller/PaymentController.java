package com.mmt.controller;

import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.response.my.MyPaymentRes;
import com.mmt.domain.response.pay.PaymentReadyRes;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.pay.PaymentRefundRes;
import com.mmt.service.impl.PaymentServiceImpl;
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
import org.springframework.web.servlet.view.RedirectView;

@Tag(name = "결제 API", description = "결제 관련 API입니다.")
@Slf4j
@RestController
@RequestMapping("/api/v1/pay")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceImpl paymentService;

    @Operation(summary = "결제 준비 & 요청", description = "<b>로그인한 회원이 선택한 수업을 결제</b>한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "결제 진행 중 취소되었습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "결제에 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "이미 신청한 수업입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PostMapping("/ready/{lessonId}")
    public ResponseEntity<? extends ResponseDto> readyPay(@PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        PaymentReadyRes paymentReadyRes = paymentService.readyPay(userId, lessonId);

        return new ResponseEntity<>(paymentReadyRes, paymentReadyRes.getStatusCode());
    }

    @Parameter(hidden = true)
    @GetMapping("/completed")
    public RedirectView approvePay(String pg_token, int paymentId) {
        MyPaymentRes myPaymentRes = paymentService.approvePay(pg_token, paymentId);
        log.debug("성공 : domain uri");
        String redirectURL = "https://i9c111.p.ssafy.io/payment/success?paymentId=" + paymentId
                +"&payStatus=" + PayStatus.COMPLETED;
//        String redirectURL = "http://localhost:3000/payment/success?paymentId=" + paymentId
//                +"&payStatus=" + PayStatus.COMPLETED;
        return new RedirectView(redirectURL);
    }

    @Parameter(hidden = true)
    @GetMapping("/fail")
    public RedirectView failPay(int paymentId) {
        paymentService.failPay(paymentId);
        String redirectURL = "https://i9c111.p.ssafy.io/payment/fail?paymentId=" + paymentId
                +"&payStatus=" + PayStatus.FAIL;
//        String redirectURL = "http://localhost:3000/payment/fail?paymentId=" + paymentId
//                +"&payStatus=" + PayStatus.FAIL;
        return new RedirectView(redirectURL);
    }

    @Parameter(hidden = true)
    @GetMapping("/cancel")
    public RedirectView cancelPay(int paymentId) {
        // TODO: 취소 처리
        paymentService.cancelPay(paymentId);
        String redirectURL = "https://i9c111.p.ssafy.io/payment/cancel?paymentId=" + paymentId
                +"&payStatus=" + PayStatus.CANCEL;
//        String redirectURL = "http://localhost:3000/payment/cancel?paymentId=" + paymentId
//                +"&payStatus=" + PayStatus.CANCEL;
        return new RedirectView(redirectURL);
    }

    @Operation(summary = "결제 환불하기", description = "<b>선택한 수업을 환불</b>한다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 결제 항목입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "결제 완료 상태가 아닌 항목입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("/refund/{lessonId}")
    public ResponseEntity<MyPaymentRes> refundPay(@PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        MyPaymentRes myPaymentRes = paymentService.refundPay(userId, lessonId);

        return new ResponseEntity<>(myPaymentRes, HttpStatus.OK);
    }

    @Operation(summary = "결제 정보 가져오기", description = "결제 번호에 해당하는 결제 정보를 가져온다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "자신의 결제 내역만 볼 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping("/{paymentId}")
    public ResponseEntity<? extends ResponseDto> getPaymentHistory(@PathVariable int paymentId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        ResponseDto myPaymentRes = paymentService.getPaymentHistory(paymentId, userId);

        return new ResponseEntity<>(myPaymentRes, myPaymentRes.getStatusCode());
    }
}
