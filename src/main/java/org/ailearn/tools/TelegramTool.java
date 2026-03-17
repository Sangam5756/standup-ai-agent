package org.ailearn.tools;


import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
public class TelegramTool {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    @Tool(description = "Send the formatted standup message to Telegram. Always call this after FormatTool.")
    public String sendToTelegram(String formattedMessage) {
        if (formattedMessage == null || formattedMessage.isBlank()) {
            throw new IllegalArgumentException("Formatted message cannot be null or empty");
        }

        String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        RestClient.create()
                .post()
                .uri(url)
                .body(Map.of(
                        "chat_id", chatId,
                        "text", formattedMessage,
                        "parse_mode", "Markdown"
                ))
                .retrieve()
                .toBodilessEntity();

        log.info("Standup message sent to Telegram successfully");
        return "SUCCESS: standup sent to Telegram";
    }
}
