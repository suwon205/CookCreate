package com.mmt.domain.entity.lesson;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LessonCategory { // 과외 카테고리
    /**
     1, 한식
     2, 양식
     3, 중식
     4, 일식
     5, 아시안
     6, 건강식
     7, 디저트
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryId;
    private String categoryTitle;

    // lesson 등록할 때 category 제어할 수 있어야 함 -> lesson category에서 제어하면 X
//    @OneToMany
//    @JoinColumn(name = "category_id")
//    private List<Lesson> lessonList = new ArrayList<>();
}