package org.ailearn.repositories;

import org.ailearn.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByConnectCode(String connectCode);
    Optional<User> findByTelegramChatId(Long telegramChatId);
}
