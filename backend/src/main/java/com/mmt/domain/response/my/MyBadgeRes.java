package com.mmt.domain.response.my;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.badge.Badge;
import com.mmt.domain.entity.badge.Certificated;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MyBadgeRes extends ResponseDto {
    private int badgeId;
    private String capture;
    private Certificated certificated;
    private String createdDate;
    private String modifiedDate;

    public MyBadgeRes(Badge badge){
        this.badgeId = badge.getBadgeId();
        this.capture = badge.getCapture();
        this.certificated = badge.getCertificated();
        this.createdDate = badge.getCreatedDate().toString();
        this.modifiedDate = badge.getModifiedDate().toString();
    }
}
