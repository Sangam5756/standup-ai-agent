package org.ailearn.controllers;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ailearn.repositories.UserRepository;
import org.ailearn.services.TelegramService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/telegram")
@RequiredArgsConstructor
public class TelegramWebhookController {

    private static final Logger log = LoggerFactory.getLogger(TelegramWebhookController.class);
    private final UserRepository userRepository;
    private final TelegramService telegramService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody TelegramUpdate update) {
        if (update.message() == null) {
            return ResponseEntity.ok().build();
        }

        Long chatId = update.message().chat().id();
        String text = update.message().text();
        String username = update.message().from().firstName();

        log.info("Message from {} (chatId: {}): {}", username, chatId, text);

        if (text != null && text.matches("\\d{6}")) { // Expecting a 6-digit code
            var optionalUser = userRepository.findByConnectCode(text);
            
            if (optionalUser.isPresent()) {
                var user = optionalUser.get();
                if (user.getConnectCodeExpiry().isAfter(LocalDateTime.now())) {
                    user.setTelegramChatId(chatId);
                    user.setTelegramConnected(true);
                    user.setConnectCode(null);
                    user.setConnectCodeExpiry(null);
                    userRepository.save(user);

                    telegramService.sendMessage(chatId, "✅ Successfully connected your account, " + user.getName() + "!");
                    log.info("User {} connected to Telegram Chat ID {}", user.getEmail(), chatId);
                } else {
                    telegramService.sendMessage(chatId, "❌ That connect code has expired. Please generate a new one.");
                }
            } else {
                telegramService.sendMessage(chatId, "❌ Invalid connect code.");
            }
        }

        return ResponseEntity.ok().build();
    }
}

// ── Telegram update structure ─────────────────────────────
@JsonIgnoreProperties(ignoreUnknown = true)
record TelegramUpdate(
    @JsonProperty("update_id") Long updateId,
    @JsonProperty("message") TelegramMessage message
) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record TelegramMessage(
    @JsonProperty("message_id") Long messageId,
    @JsonProperty("from") TelegramUser from,
    @JsonProperty("chat") TelegramChat chat,
    @JsonProperty("text") String text
) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record TelegramUser(
    @JsonProperty("id") Long id,
    @JsonProperty("first_name") String firstName,
    @JsonProperty("username") String username
) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record TelegramChat(
    @JsonProperty("id") Long id
) {}
