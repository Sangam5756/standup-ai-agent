package org.ailearn.tools;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ailearn.models.StandupEntry;
import org.ailearn.repositories.StandupEntryRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class DatabaseTool {
    private final StandupEntryRepository repository;

    @Tool(description = "Save the formatted standup to the database. Always call this last, after TelegramTool.")
    public String saveStandup(String developerName, String rawUpdate, String formattedStandup, Boolean telegramSent) throws Exception {

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
            StandupEntry entry = repository.save(new StandupEntry(
                    developerName, rawUpdate, formattedStandup, telegramSent
            ));
            log.info("Standup saved successfully for developer: {}, ID: {}", developerName, entry.getId());
            return "SUCCESS: standup saved to database with ID: " + entry.getId();
        } catch (DataAccessException e) {
            log.error("Database error while saving standup for developer: {}", developerName, e);
            throw new RuntimeException("Failed to save standup to database: " + e.getMessage(), e);
        }

    }

}
