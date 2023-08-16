package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.LessonParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonParticipantRepository extends JpaRepository<LessonParticipant, Integer> {
    List<LessonParticipant> findByLesson_LessonId(int lessonId);
    List<LessonParticipant> findAllByMember_UserIdAndIsLeaveChat(String userId, boolean isLeave);
    List<LessonParticipant> findAllByLesson_LessonId(int lessonId);
    List<LessonParticipant> findAllByMember_UserId(String userId);
    Optional<LessonParticipant> findByLesson_LessonIdAndMember_UserId(int lessonId, String userId);

    @Modifying
    @Query("UPDATE LessonParticipant lp SET lp.isCompleted=:completed where lp.lesson.lessonId=:lessonid")
    int updateCompleted(@Param(value="completed") boolean completed, @Param(value="lessonid") int lessonid);
}
