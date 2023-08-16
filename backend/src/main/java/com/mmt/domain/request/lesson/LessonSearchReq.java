package com.mmt.domain.request.lesson;

import lombok.Data;

import java.util.List;

@Data
public class LessonSearchReq {
    private String type;
    private String keyword;
    private List<Integer> category;
    private String order;
    private boolean deadline;
}
