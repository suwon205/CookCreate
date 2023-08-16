package com.mmt.domain.request.session;

import lombok.Data;

@Data
public class SessionPostReq {
    private int lessonId;
    private String userId;
    private String sessionId;
}
