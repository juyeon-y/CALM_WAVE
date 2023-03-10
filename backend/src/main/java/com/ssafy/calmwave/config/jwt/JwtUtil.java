package com.ssafy.calmwave.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.ssafy.calmwave.repository.UserRepository;
import com.ssafy.calmwave.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

//        public static final int AccessTokenTimeLimit = 60 * 1000; //1분
    public static final int AccessTokenTimeLimit = 60000 * 60 * 24 * 15; //토큰 발급 시간대가 utc라 14일에서 하루 더해줬음
    public static final int RefreshTokenTimeLimit = 1000 * 60 * 60 * 24 * 7;

    private static String secret;
    private final UserRepository userRepository;

    public JwtUtil(@Value("${my.secret}") String secret, UserRepository userRepository) {
        this.secret = secret;
        this.userRepository = userRepository;
    }

    // 토큰 검증
    public static Boolean tokenValidation(String token) {
        Logger logger = LoggerFactory.getLogger(JwtUtil.class);
        logger.info("token validation check");
        try {
            String username = JWT.require(Algorithm.HMAC512(secret))
                    .build().verify(token)
                    .getClaim("username").asString();
            return true;
        } catch (Exception ex) {
            logger.info("불량토큰 발견입니다 발견...");
            log.error(ex.getMessage());
            return false;
        }
    }

    public static String createToken(long id, String username) {
        Date now = new Date();
        String token = JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(now.getTime() + AccessTokenTimeLimit))
                .withClaim("id", id)
                .withClaim("username", username)
                .sign(Algorithm.HMAC512(secret));
        return token;
    }

    public static String createRefreshToken(long id, String username) {
        Date now = new Date();
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DATE, 30);
        System.out.println(c.getTime());
        String token = JWT.create()
                .withSubject(username)
                .withAudience(username)
                .withExpiresAt(c.getTime())
                .withClaim("id", id)
                .withClaim("username", username)
                .sign(Algorithm.HMAC512(secret));
        return token;
    }

    // JWT 복호화 해서 유저 얻기
    public User getUser(String token) {
        String accessToken = token.replace("Bearer ", "");

        String username = JWT.require(Algorithm.HMAC512(secret)).build().verify(accessToken)
                .getClaim("username").asString();
        User user = userRepository.findByUsername(username);
        return user;
    }
}
