package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.request.lesson.LessonSearchReq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LessonRepositoryCustom {

    List<Lesson> findBySearchOption(LessonSearchReq lessonSearchReq);
}
