package com.mmt.domain.response.auth;

import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;

@Data
public class UserLoginRes extends ResponseDto {
    private String nickname;
    private Role role;
}
