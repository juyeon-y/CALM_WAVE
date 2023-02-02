package com.ssafy.calmwave.service;

import com.ssafy.calmwave.config.repository.UserRepository;
import com.ssafy.calmwave.dto.UserInfoDto;
import com.ssafy.calmwave.model.User;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void invalidateUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.get().setUsername(UUID.randomUUID().toString());
        user.get().setPassword(UUID.randomUUID().toString());
        user.get().setDeleted(Byte.parseByte("1"));
    }

    @Transactional
    public void updateUser(UserInfoDto userInfoDto) {
        Optional<User> user = userRepository.findById(userInfoDto.getId());
        user.get().setNickname(userInfoDto.getNickname());
        user.get().setStretchingIntervalMin(userInfoDto.getStretchingIntervalMin());
    }
}