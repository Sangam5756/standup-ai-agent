package org.ailearn.tools;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ailearn.models.StandupEntry;
import org.ailearn.models.User;
import org.ailearn.repositories.StandupEntryRepository;
import org.ailearn.repositories.UserRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class DatabaseTool {
    private final StandupEntryRepository repository;
    private final UserRepository userRepository;

    @Tool(description = "Save the formatted standup to the database and link it to the user. Always call this last, after TelegramTool.")
    public String saveStandup(Long userId, String developerName, String rawUpdate, String formattedStandup, Boolean telegramSent) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required for ownership");
        }

        if (developerName == null || developerName.isBlank()) {
            log.error("Developer name validation failed: null or empty");
            throw new IllegalArgumentException("Developer name is required");
        }

        if (rawUpdate == null || rawUpdate.isBlank()) {
            log.error("Raw update validation failed: null or empty");
            throw new IllegalArgumentException("Raw update is required");
        }

        if (formattedStandup == null || formattedStandup.isBlank()) {
            log.error("Formatted standup validation failed: null or empty");
            throw new IllegalArgumentException("Formatted standup cannot be empty");
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

            StandupEntry entry = new StandupEntry();
            entry.setUser(user);
            entry.setDeveloperName(developerName);
            entry.setRawUpdate(rawUpdate);
            entry.setFormattedStandup(formattedStandup);
            entry.setTelegramSent(telegramSent);
            
            repository.save(entry);
            log.info("Standup saved successfully for user {} (ID: {}), Entry ID: {}", user.getEmail(), userId, entry.getId());
            return "SUCCESS: standup saved to database with ID: " + entry.getId();
        } catch (Exception e) {
            log.error("Database error while saving standup for user ID: {}", userId, e);
            throw new RuntimeException("Failed to save standup to database: " + e.getMessage(), e);
        }
    }
}
