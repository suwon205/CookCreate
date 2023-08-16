package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonStepRepository extends JpaRepository<LessonStep, Integer> {
    List<LessonStep> findByLesson_LessonId(int lessonId);
    void deleteAllByLesson_LessonId(int lessonId);
}
