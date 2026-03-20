package org.ailearn.services;

import lombok.RequiredArgsConstructor;
import org.ailearn.models.User;
import org.ailearn.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public String generateTelegramConnectCode(User user) {
        // Generate a random 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));
        
        user.setConnectCode(code);
        user.setConnectCodeExpiry(LocalDateTime.now().plusMinutes(15)); // Valid for 15 minutes
        userRepository.save(user);
        
        return code;
    }
}
