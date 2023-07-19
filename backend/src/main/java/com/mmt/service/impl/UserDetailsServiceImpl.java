package com.mmt.service.impl;

import com.mmt.domain.entity.Member;
import com.mmt.domain.entity.UserDetailsImpl;
import com.mmt.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService { // userDetailsImpl에 member를 넣어주는 서비스

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Member member = memberRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("Not Found Account")
        );

        UserDetailsImpl userDetails = new UserDetailsImpl();
        userDetails.setMember(member);

        return userDetails;
    }
}
