package org.ailearn.services;

import org.ailearn.models.StandupEntry;
import org.ailearn.repositories.StandupEntryRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeeklySummaryService {

    private final StandupEntryRepository repository;
    private final ChatClient chatClient;

    public WeeklySummaryService(StandupEntryRepository repository,
                                ChatClient.Builder builder) {
        this.repository = repository;
        this.chatClient = builder.build();
    }

    public String getWeeklySummary() {
        List<StandupEntry> entries = repository
                .findEntriesSince(LocalDateTime.now().minusDays(7));

        if (entries.isEmpty()) {
            return "No standup entries found for the last 7 days.";
        }

        String allStandups = entries.stream()
                .map(e -> "Date: " + e.getCreatedAt().toLocalDate()
                        + "\n" + e.getFormattedStandup())
                .collect(Collectors.joining("\n\n---\n\n"));

        return chatClient.prompt()
                .user("""
                Here are the standups from the last 7 days:
                
                """ + allStandups + """
                
                Please write a concise weekly summary covering:
                - Key things accomplished this week
                - What was worked on most
                - Any recurring blockers
                Keep it to 5-6 bullet points maximum.
                """)
                .call()
                .content();
    }
}