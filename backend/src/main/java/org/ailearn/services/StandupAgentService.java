package org.ailearn.services;

import lombok.extern.slf4j.Slf4j;
import org.ailearn.dtos.StandupRequest;
import org.ailearn.tools.DatabaseTool;
import org.ailearn.tools.FormatTool;
import org.ailearn.tools.TelegramTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
@Slf4j
@Service
public class StandupAgentService {

    private final ChatClient chatClient;

    public StandupAgentService(ChatClient.Builder builder,
                               FormatTool formatTool,
                               TelegramTool telegramTool,
                               DatabaseTool databaseTool) {
        this.chatClient = builder
                .defaultSystem("""
                You are a daily standup formatting agent for a software developer.
                
                When you receive a raw standup update, you MUST follow these steps in exact order:
                
                STEP 1 — Call formatStandup tool with developerName and rawUpdate.
                STEP 2 — Take the result from formatStandup and call sendToTelegram with the formatted message AND the provided telegramChatId.
                STEP 3 — Call saveStandup with the provided userId, developerName, rawUpdate, the formatted message, and whether Telegram succeeded.
                
                Context for this session:
                - Developer Name: {developerName}
                - User ID: {userId}
                - Telegram Chat ID: {telegramChatId}
                
                Formatting rules:
                - ✅ for completed tasks
                - 🔨 for work in progress
                - 🚧 for blockers
                - 📅 for today's plan
                - Keep each bullet short and professional
                
                Never skip any step. Always call all 3 tools in order using the provided IDs.
                After all 3 tools are done, return a confirmation message to the user.
                """)
                .defaultTools(formatTool, telegramTool, databaseTool)
                .build();
    }

    public String generateAndPost(org.ailearn.dtos.StandupRequest request, org.ailearn.models.User user) {
        log.info("Agent started for user: {} ({})", user.getEmail(), user.getName());
        
        String chatId = user.getTelegramChatId() != null ? user.getTelegramChatId().toString() : null;
        
        if (chatId == null) {
            return "❌ Error: Your Telegram is not connected. Please connect your account first via /api/user/telegram/connect";
        }

        try {
            return chatClient.prompt()
                    .system(sp -> sp.params(java.util.Map.of(
                            "developerName", user.getName(),
                            "userId", user.getId(),
                            "telegramChatId", chatId
                    )))
                    .user("Raw update: " + request.getRawUpdate())
                    .call()
                    .content();
        } catch (Exception ex) {
            log.error("LLM call failed for user {}: {}", user.getEmail(), ex.getMessage());
            throw new RuntimeException("LLM failed to process standup", ex);
        }
    }
}