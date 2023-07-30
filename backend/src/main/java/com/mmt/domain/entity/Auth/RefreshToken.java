package com.mmt.domain.entity.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class RefreshToken { // 로그인 성공할 시 refresh 토큰을 db에 저장하기 위한 domain

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int refreshTokenId;
    private String refreshToken;
    private String userId;

    public RefreshToken(String refreshToken, String userId){
        this.refreshToken = refreshToken;
        this.userId = userId;
    }

    public RefreshToken updateToken(String refreshToken){
        this.refreshToken = refreshToken;
        return this;
    }

}
