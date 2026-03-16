package org.ailearn.services;

import org.ailearn.dtos.StandupRequest;
import org.ailearn.tools.DatabaseTool;
import org.ailearn.tools.FormatTool;
import org.ailearn.tools.TelegramTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

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
                STEP 2 — Take the result from formatStandup and call sendToTelegram with the formatted message.
                STEP 3 — Call saveStandup with developerName, rawUpdate, the formatted message, and whether Telegram succeeded.
                
                Formatting rules:
                - ✅ for completed tasks
                - 🔨 for work in progress
                - 🚧 for blockers
                - 📅 for today's plan
                - Keep each bullet short and professional
                
                Never skip any step. Always call all 3 tools in order.
                After all 3 tools are done, return a confirmation message to the user.
                """)
                .defaultTools(formatTool, telegramTool, databaseTool)
                .build();
    }

    public String generateAndPost(org.ailearn.dtos.StandupRequest request) {
        return chatClient.prompt()
                .user("Developer: " + request.getDeveloperName()
                        + "\nRaw update: " + request.getRawUpdate())
                .call()
                .content();
    }
}