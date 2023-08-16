package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.LessonCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonCategoryRepository extends JpaRepository<LessonCategory, Integer> {
}
