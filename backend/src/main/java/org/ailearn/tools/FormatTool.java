package org.ailearn.tools;


import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
public class FormatTool {


    @Tool(description = "Format the developer's raw standup update into professional bullet points with emojis. Use ✅ for completed tasks, 🔨 for in progress, 🚧 for blockers, 📅 for today's plan. Always call this first before any other tool.")
    public String formatStandup(String developerName, String rawUpdate) {
        if (developerName == null || developerName.isBlank()) {
            throw new IllegalArgumentException("Developer name cannot be null or empty");
        }

        if (rawUpdate == null || rawUpdate.isBlank()) {
            throw new IllegalArgumentException("Raw update cannot be null or empty");
        }

        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        String formattedMessage = String.format("👤 %s's Standup — %s\n\n%s",
                developerName, date, rawUpdate);

        log.info("Standup formatted for developer: {}", developerName);
        return formattedMessage;
    }
}