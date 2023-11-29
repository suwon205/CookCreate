package com.mmt.service.impl;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.entity.pay.PaymentHistory;
import com.mmt.domain.response.my.MyPaymentRes;
import com.mmt.domain.response.pay.PaymentApproveRes;
import com.mmt.domain.response.pay.PaymentReadyRes;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.pay.PaymentRefundRes;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.PaymentRepository;
import com.mmt.repository.lesson.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final LessonRepository lessonRepository;
    private WebClient webClient;
    private final RedisTemplate redisTemplate;

    @Value("${kakao_key}")
    private String kakao_key;

    @PostConstruct
    public void initWebClient() {
        webClient = WebClient.builder()
                .baseUrl("https://kapi.kakao.com/v1/payment")
                .defaultHeaders(h -> h.addAll(setHeaders()))
                .build();
    }

    @Transactional
    public PaymentReadyRes readyPay(String userId, int lessonId) {
       Optional<PaymentHistory> payment = paymentRepository.findFirstByLesson_LessonIdAndMember_UserIdOrderByApprovedAtDesc(lessonId, userId);
        if(payment.isPresent() && payment.get().getPayStatus() == PayStatus.COMPLETED) {
            return new PaymentReadyRes(HttpStatus.CONFLICT, "이미 신청한 수업입니다.");
        }

        Member member = memberRepository.findByUserId(userId).get();
        Lesson lesson = lessonRepository.findById(lessonId).get();

        PaymentHistory paymentHistory = new PaymentHistory();

        paymentHistory.setTotalAmount(lesson.getPrice());
        paymentHistory.setMember(member);
        paymentHistory.setLesson(lesson);
        paymentRepository.save(paymentHistory);

        MultiValueMap<String, String> parameter = new LinkedMultiValueMap<>();

        parameter.add("cid", "TC0ONETIME");
        parameter.add("partner_order_id", String.valueOf(paymentHistory.getPaymentId()));
        parameter.add("partner_user_id", userId);
        parameter.add("item_name",paymentHistory.getLesson().getLessonTitle());
        parameter.add("quantity", "1");
        parameter.add("total_amount", String.valueOf(paymentHistory.getTotalAmount()));
        parameter.add("tax_free_amount", "0");
        // 배포용 수정
         parameter.add("approval_url", "http://localhost:8080/api/v1/pay/completed?paymentId=" + paymentHistory.getPaymentId());
         parameter.add("cancel_url", "http://localhost:8080/api/v1/pay/cancel?paymentId=" + paymentHistory.getPaymentId());
         parameter.add("fail_url", "http://localhost:8080/api/v1/pay/fail?paymentId=" + paymentHistory.getPaymentId());
//        parameter.add("approval_url", "http://i9c111.p.ssafy.io/api/v1/pay/completed?paymentId=" + paymentHistory.getPaymentId());
//        parameter.add("cancel_url", "http://i9c111.p.ssafy.io/api/v1/pay/cancel?paymentId=" + paymentHistory.getPaymentId());
//        parameter.add("fail_url", "http://i9c111.p.ssafy.io/api/v1/pay/fail?paymentId=" + paymentHistory.getPaymentId());

        log.debug("use webClient before");

        PaymentReadyRes paymentReadyRes = webClient.post()
                .uri("/ready")
                .body(BodyInserters.fromFormData(parameter))
                .retrieve()
                .bodyToMono(PaymentReadyRes.class)
                .block();

//        paymentHistory.setTId(paymentReadyRes.getTid());

        paymentHistory.setPayStatus(PayStatus.READY);
        paymentRepository.save(paymentHistory);

        redisTemplate.opsForValue().set(
                "kakaopay:tid" + paymentHistory.getPaymentId(),
                paymentReadyRes.getTid(),
                Duration.ofDays(7).toMillis(),
                TimeUnit.MILLISECONDS
        );

        paymentReadyRes.setStatusCode(HttpStatus.OK);
        paymentReadyRes.setMessage("success");

        return paymentReadyRes;
    }

    @Transactional
    public MyPaymentRes approvePay(String pg_Token, int paymentId) {
        PaymentHistory paymentHistory = paymentRepository.findByPaymentId(paymentId).get();

        String tid = (String) redisTemplate.opsForValue().
                get("kakaopay:tid" + paymentHistory.getPaymentId());

        log.debug("userId: " + paymentHistory.getMember().getUserId());
        log.debug("tid: " + tid);
        log.debug("pg_token: " + pg_Token);

        MultiValueMap<String, String> parameter = new LinkedMultiValueMap<>();

        parameter.add("cid", "TC0ONETIME");
        parameter.add("tid", tid);
        parameter.add("partner_order_id", String.valueOf(paymentId));
        parameter.add("partner_user_id", paymentHistory.getMember().getUserId());
        parameter.add("pg_token", pg_Token);

        PaymentApproveRes paymentApproveRes = webClient.post()
                .uri("/approve")
                .body(BodyInserters.fromFormData(parameter))
                .retrieve()
                .bodyToMono(PaymentApproveRes.class)
                .block();

        paymentHistory.setApprovedAt(paymentApproveRes.getApproved_at());
        paymentHistory.setPayStatus(PayStatus.COMPLETED);
        paymentRepository.save(paymentHistory);

        if(paymentHistory.getApprovedAt() == null) {
            return new MyPaymentRes(HttpStatus.BAD_REQUEST, "결제에 실패했습니다.");
        }

        MyPaymentRes myPaymentRes = new MyPaymentRes(paymentHistory);
        myPaymentRes.setStatusCode(HttpStatus.OK);
        myPaymentRes.setMessage("success");

        return myPaymentRes;
    }

    @Transactional
    public ResponseDto failPay(int paymentId) {
        PaymentHistory paymentHistory = paymentRepository.findByPaymentId(paymentId).get();
        paymentHistory.setPayStatus(PayStatus.FAIL);
        paymentRepository.save(paymentHistory);

        return new ResponseDto(HttpStatus.BAD_REQUEST, "결제에 실패했습니다.");
    }

    @Transactional
    public ResponseDto cancelPay(int paymentId) {
        PaymentHistory paymentHistory = paymentRepository.findByPaymentId(paymentId).get();
        paymentHistory.setPayStatus(PayStatus.CANCEL);
        paymentRepository.save(paymentHistory);

        return new ResponseDto(HttpStatus.BAD_REQUEST, "결제 진행 중 취소되었습니다.");
    }

    @Transactional
    public MyPaymentRes refundPay(String userId, int lessonId) {
        Optional<PaymentHistory> payment = paymentRepository.findFirstByLesson_LessonIdAndMember_UserIdOrderByApprovedAtDesc(lessonId, userId);
        if(!payment.isPresent()) {
            return new MyPaymentRes(HttpStatus.BAD_REQUEST, "존재하지 않는 결제 항목입니다.");
        } else if(payment.get().getPayStatus() != PayStatus.COMPLETED) {
            return new MyPaymentRes(HttpStatus.BAD_REQUEST, "결제 완료 상태가 아닌 항목입니다.");
        }

        PaymentHistory paymentHistory = payment.get();

        String tid = (String) redisTemplate.opsForValue().
                get("kakaopay:tid" + paymentHistory.getPaymentId());

        log.debug(tid);

        MultiValueMap<String, String> parameter = new LinkedMultiValueMap<>();

        parameter.add("cid", "TC0ONETIME");
        parameter.add("tid", tid);
        parameter.add("cancel_amount", String.valueOf(paymentHistory.getTotalAmount()));
        parameter.add("cancel_tax_free_amount", "0");

        PaymentRefundRes paymentRefundRes = webClient.post()
                .uri("/cancel")
                .body(BodyInserters.fromFormData(parameter))
                .retrieve()
                .bodyToMono(PaymentRefundRes.class)
                .block();

        paymentHistory.setCanceledAt(paymentRefundRes.getCanceled_at());
        paymentHistory.setPayStatus(PayStatus.REFUND);
        paymentRepository.save(paymentHistory);

        if(paymentHistory.getCanceledAt() == null) {
            return new MyPaymentRes(HttpStatus.BAD_REQUEST, "결제 취소에 실패했습니다.");
        }

        MyPaymentRes myPaymentRes = new MyPaymentRes(paymentHistory);
        myPaymentRes.setCanceledAt(paymentHistory.getCanceledAt().toString());
        myPaymentRes.setStatusCode(HttpStatus.OK);
        myPaymentRes.setMessage("결제 취소가 완료되었습니다.");

        redisTemplate.delete("kakaopay:tid" + paymentHistory.getPaymentId());

        return myPaymentRes;

    }

    public ResponseDto getPaymentHistory(int paymentId, String userId) {
        PaymentHistory paymentHistory = paymentRepository.findByPaymentId(paymentId).get();

        if(!userId.equals(paymentHistory.getMember().getUserId())) {
            return new ResponseDto(HttpStatus.FORBIDDEN, "자신의 결제 내역만 볼 수 있습니다.");
        }

        MyPaymentRes myPaymentRes = new MyPaymentRes(paymentHistory);

        myPaymentRes.setStatusCode(HttpStatus.OK);
        myPaymentRes.setMessage("success");

        return myPaymentRes;
    }

    private HttpHeaders setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakao_key);
        headers.set("Content-type", "Content-type: application/x-www-form-urlencoded;charset=utf-8");
        return headers;
    }
}
