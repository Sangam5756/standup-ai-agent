package org.ailearn.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Service
public class TelegramService {

    @Value("${telegram.bot.token}")
    private String botToken;

    public void sendMessage(Long chatId, String text) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            log.info("Sending message to Telegram chat {}: {}", chatId, text);
            RestClient.create()
                    .post()
                    .uri(url)
                    .body(Map.of(
                            "chat_id", chatId.toString(),
                            "text", text,
                            "parse_mode", "Markdown"
                    ))
                    .retrieve()
                    .toBodilessEntity();

            log.info("Message sent to Telegram chat {} successfully", chatId);
        } catch (Exception ex) {
            log.error("Failed to send message to Telegram chat {}: {}", chatId, ex.getMessage());
        }
    }
}
