package com.mmt.repository.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.request.lesson.LessonSearchReq;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

import static com.mmt.domain.entity.lesson.QLesson.lesson;

public class LessonRepositoryImpl extends QuerydslRepositorySupport implements LessonRepositoryCustom {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    public LessonRepositoryImpl(){
        super(Lesson.class);
    }

    @Override
    public List<Lesson> findBySearchOption(LessonSearchReq lessonSearchReq) {
        List<Lesson> content = jpaQueryFactory
                .selectFrom(lesson)
                .where(containKeyword(lessonSearchReq.getType(), lessonSearchReq.getKeyword()))
                .orderBy(lessonSort(lessonSearchReq.getOrder()))
                .fetch();
        return content;
    }

    private BooleanExpression containKeyword(String type, String keyword) {
        if(keyword == null || keyword.isEmpty()) {
            return null;
        }else{
            if(type == null || type.isEmpty()){
                return null; // keyword가 있는데 type이 없으면 안됨
            }else{
                if(type.equals("all")){
                    return lesson.lessonTitle.containsIgnoreCase(keyword).or(lesson.cookyerName.containsIgnoreCase(keyword)).or(lesson.materials.containsIgnoreCase(keyword));
                }else if(type.equals("title")){
                    return lesson.lessonTitle.containsIgnoreCase(keyword);
                }else if(type.equals("cookyer")){
                    return lesson.cookyerName.containsIgnoreCase(keyword);
                }else if(type.equals("ingre")){
                    return lesson.materials.containsIgnoreCase(keyword);
                }
            }
        }
        return null;
    }

    private OrderSpecifier<?> lessonSort(String order){
        if(order == null || order.isEmpty()){
            return new OrderSpecifier(Order.ASC, lesson.lessonTitle);
        }else{
            if(order.equals("title")){
                return new OrderSpecifier(Order.ASC, lesson.lessonTitle);
            }else if(order.equals("price")){
                return new OrderSpecifier(Order.ASC, lesson.price);
            }
        }
        return new OrderSpecifier(Order.ASC, lesson.lessonTitle);
    }
}
