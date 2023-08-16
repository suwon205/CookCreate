package com.mmt.domain.response.pay;

import com.mmt.domain.response.ResponseDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentRefundRes {
    private String aid;
    private String tid;
    private String cid;
    private String partner_order_id;
    private String partner_user_id;
    private ApprovedCancelAmount Approved_cancel_amount;
    private String item_name;
    private LocalDateTime created_at;
    private LocalDateTime approved_at;
    private LocalDateTime canceled_at;

}
