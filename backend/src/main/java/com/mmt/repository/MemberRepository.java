package com.mmt.repository;

import com.mmt.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByUserId(String userId);
    Optional<Member> findByNickname(String nickname);
}
