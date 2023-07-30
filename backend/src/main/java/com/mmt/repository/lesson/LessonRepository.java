package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer>, LessonRepositoryCustom {
    Optional<Lesson> findByLessonId(int lessonId);
    List<Lesson> findAllByCookyerId(String cookyerId, Sort createdDate);
    void deleteByLessonId(int lessonId);
}
