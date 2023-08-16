package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer>, LessonRepositoryCustom {
    Optional<Lesson> findByLessonId(int lessonId);
    List<Lesson> findAllByCookyerId(String cookyerId, Sort createdDate);
    List<Lesson> findAllByCookyerId(String cookyerId);
    void deleteByLessonId(int lessonId);
    List<Lesson> findAllByIsOver(boolean isOver);

    @Modifying
    @Query("UPDATE Lesson l SET l.isEnd=:isend where l.lessonId=:lessonid")
    int updateIsEnd(@Param(value="isend") boolean isend, @Param(value="lessonid") int lessonid);
}
