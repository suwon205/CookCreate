package com.mmt.repository;

import com.mmt.domain.entity.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByLesson_LessonId(int lessonId);
    List<Review> findAllByMember_UserId(String userId);

}
