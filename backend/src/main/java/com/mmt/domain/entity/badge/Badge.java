package com.mmt.domain.entity.badge;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.auth.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@DynamicUpdate
public class Badge extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int badgeId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;

    private String capture;
    private Certificated certificated = Certificated.DEFAULT;
}
