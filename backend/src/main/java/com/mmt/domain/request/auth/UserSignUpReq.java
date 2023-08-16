package com.mmt.domain.request.auth;

import com.mmt.domain.entity.auth.Role;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.*;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignUpReq {

    @Length(min = 4, max = 10, message = "아이디는 4자 이상 10자 이하여야 합니다.")
    @NotBlank(message = "아이디를 입력해주세요.")
    private String userId;
    @Length(min = 4, max = 16, message = "비밀번호는 4자 이상 16자 이하여야 합니다.")
    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String userPw;
    @NotBlank(message = "비밀번호 확인을 입력해주세요.")
    private String userPwCk; // 패스워드 확인을 위한 필드
    @Length(min = 2, max = 8, message = "닉네임은 2자 이상 8자 이하여야 합니다.")
    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;
    private String phoneNumber;
    @Email(message = "이메일 형식을 지켜주세요.")
    private String userEmail;
    private List<Integer> food;
    private Role role;

    public void setEncodePw(String encodePw){
        this.userPw = encodePw;
    }
}
