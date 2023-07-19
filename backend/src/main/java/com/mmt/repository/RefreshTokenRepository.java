package com.mmt.repository;

import com.mmt.domain.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    Optional<RefreshToken> findByUserId(String userId); // db에서 유저 정보로 refresh token을 찾기 위한 메소드
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
