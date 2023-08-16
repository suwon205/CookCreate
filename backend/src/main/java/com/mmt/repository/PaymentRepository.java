package com.mmt.repository;

import com.mmt.domain.entity.pay.PayStatus;
import com.mmt.domain.entity.pay.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentHistory, Integer> {
    Optional<PaymentHistory> findByPaymentId(int paymentId);
    Optional<PaymentHistory> findFirstByLesson_LessonIdAndMember_UserIdOrderByApprovedAtDesc(int lessonId, String userId);
    List<PaymentHistory> findAllByMember_UserIdAndPayStatusNot(String userId, PayStatus payStatus);
    List<PaymentHistory> findAllByLesson_CookyerIdAndPayStatusNot(String userId, PayStatus payStatus);
}
