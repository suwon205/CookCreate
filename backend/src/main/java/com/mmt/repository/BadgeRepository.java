package com.mmt.repository;

import com.mmt.domain.entity.badge.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Integer> {
    List<Badge> findAllByMember_UserId(String userId);
}
