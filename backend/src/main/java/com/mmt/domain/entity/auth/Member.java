package com.mmt.domain.entity.auth;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.request.auth.UserSignUpReq;
import com.mmt.domain.request.auth.UserUpdateReq;
import com.mmt.domain.entity.auth.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@DynamicUpdate
public class Member extends BaseTimeEntity {

    @Id
    private String userId;
    private String userPw;
    private String nickname;
    private String phoneNumber;
    private String userEmail;
    private String food;
    private Role role;
    private String introduce;
    private String profileImg;

//    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
//    private List<LessonParticipant> lessonParticipantList = new ArrayList<>();

    public Member(UserSignUpReq userSignUpReq){
        this.userId = userSignUpReq.getUserId();
        this.userPw = userSignUpReq.getUserPw();
        this.nickname = userSignUpReq.getNickname();
        this.phoneNumber = userSignUpReq.getPhoneNumber();
        this.userEmail = userSignUpReq.getUserEmail();
        if(userSignUpReq.getFood() != null){
            this.food = userSignUpReq.getFood()
                    .stream().map(String::valueOf)
                    .collect(Collectors.joining(","));
        }
        this.role = userSignUpReq.getRole();
    }

    public void update(UserUpdateReq userUpdateReq){
//        this.userPw = userUpdateReq.getUserPw();
        this.nickname = userUpdateReq.getNickname();
        this.phoneNumber = userUpdateReq.getPhoneNumber();
        this.userEmail = userUpdateReq.getUserEmail();
        this.food = userUpdateReq.getFood();
//        if(userUpdateReq.getFood() != null){
//            this.food = userUpdateReq.getFood()
//                    .stream().map(String::valueOf)
//                    .collect(Collectors.joining(","));
//        }
        this.introduce = userUpdateReq.getIntroduce();
    }
}
