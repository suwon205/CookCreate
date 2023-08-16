package com.mmt.service;

import com.mmt.domain.request.jjim.JjimReq;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import com.mmt.domain.request.lesson.LessonSearchReq;
import com.mmt.domain.request.lesson.LessonStepPutReq;
import com.mmt.domain.request.session.SessionPostReq;
import com.mmt.domain.response.lesson.*;
import com.mmt.domain.response.ResponseDto;

import java.util.List;

public interface LessonService {

    ResponseDto reserve(LessonPostReq lessonPostReq);
    LessonApplyRes apply(int lessonId, String userId);
    ResponseDto modifyLesson(LessonPutReq lessonPutReq);
    ResponseDto deleteLesson(int lessonId);
    ResponseDto cancelLesson(int lessonId, String userId);
    List<LessonSearchRes> getLessonList(LessonSearchReq lessonSearchReq);
    LessonDetailRes getLessonDetail(int lessonId);
    LessonLatestRes getLessonLatest(String userId);
    ResponseDto getHavingBadge(String cookyerId);

    // 진행 단계 관련
    List<LessonStepRes> getLessonStep(int lessonId);
    ResponseDto modifyLessonStep(String userId, LessonStepPutReq lessonStepPutReq);

    // 과외 세션 관련
    ResponseDto createSession(SessionPostReq sessionPostReq);
    ResponseDto checkSession(SessionPostReq sessionPostReq);
    String getSessionId(int lessonId);
    ResponseDto deleteSession(SessionPostReq sessionPostReq);

    // 과외 찜 관련
    ResponseDto wantJjimOrNot(JjimReq jjimReq);
}
