package com.mmt.service.impl;

import com.mmt.common.auth.JwtUtil;
import com.mmt.domain.TokenDto;
import com.mmt.domain.entity.Member;
import com.mmt.domain.entity.RefreshToken;
import com.mmt.domain.request.UserLoginPostReq;
import com.mmt.domain.request.UserSignUpReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.RefreshTokenRepository;
import com.mmt.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    @Override
    public ResponseDto signUp(UserSignUpReq userSignUpReq) throws Exception {

        // 패스워드 암호화
        userSignUpReq.setEncodePw(passwordEncoder.encode(userSignUpReq.getUserPw()));
        Member member = new Member(userSignUpReq);

        // 회원가입 성공
        memberRepository.save(member);
        return new ResponseDto(HttpStatus.OK.value(), "Success");
    }

    @Transactional
    @Override
    public ResponseDto login(UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        // 아이디 검사
        Member member = memberRepository.findByUserId(userLoginPostReq.getUserId()).orElseThrow(
                () -> new RuntimeException("Not found Account")
        );

        // 비밀번호 검사
        if(!passwordEncoder.matches(userLoginPostReq.getUserPw(), member.getUserPw())) {
            throw new RuntimeException("Not matches Password");
        }

        // 아이디 정보로 Token생성
        TokenDto tokenDto = jwtUtil.createAllToken(userLoginPostReq.getUserId());

        // Refresh토큰 있는지 확인
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userLoginPostReq.getUserId());

        // 있다면 새토큰 발급후 업데이트
        // 없다면 새로 만들고 디비 저장
        if(refreshToken.isPresent()) {
            refreshTokenRepository.save(refreshToken.get().updateToken(tokenDto.getRefreshToken()));
        }else {
            RefreshToken newToken = new RefreshToken(tokenDto.getRefreshToken(), userLoginPostReq.getUserId());
            refreshTokenRepository.save(newToken);
        }

        // response 헤더에 Access Token / Refresh Token 넣음
        setHeader(response, tokenDto);

        return new ResponseDto(HttpStatus.OK.value(), "Success Login");
    }

    @Transactional
    @Override
    public ResponseDto logout(HttpServletRequest request, HttpServletResponse response) {
        jwtUtil.logout(request);

        TokenDto tokenDto = new TokenDto();
        tokenDto.setAccessToken(null);
        tokenDto.setRefreshToken(null);
        setHeader(response, tokenDto);

        return new ResponseDto(HttpStatus.OK.value(), "Success Logout");
    }

    private void setHeader(HttpServletResponse response, TokenDto tokenDto) {
        response.addHeader(JwtUtil.ACCESS_TOKEN, tokenDto.getAccessToken());
        response.addHeader(JwtUtil.REFRESH_TOKEN, tokenDto.getRefreshToken());
    }
}
