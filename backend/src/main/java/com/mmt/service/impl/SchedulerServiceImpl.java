package com.mmt.service.impl;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerServiceImpl implements SchedulerService {

    private final LessonRepository lessonRepository;

    @Override
    @Scheduled(cron = "* * * * * *")
    public void checkDeadline(){
        // 마감되지 않은 과외 조회
        List<Lesson> notClosedLessonList = lessonRepository.findAllByIsOver(false);
        for (Lesson lesson : notClosedLessonList){
            // 마감기한을 체크한다
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd\'T\'HH:mm:ss");
            LocalDateTime lessonDate = LocalDateTime.parse(lesson.getLessonDate(), formatter).minusHours(12);
            LocalDateTime now = LocalDateTime.now();
            if(now.isAfter(lessonDate)){ // 지났으면
                lesson.setIsOver(true);
                lessonRepository.save(lesson);
            }
        }

    }
}
