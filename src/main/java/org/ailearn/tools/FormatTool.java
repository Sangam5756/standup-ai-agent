package org.ailearn.tools;


import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class FormatTool {


    @Tool(description = "Format the developer's raw standup update into professional bullet points with emojis. Use ✅ for completed tasks, 🔨 for in progress, 🚧 for blockers, 📅 for today's plan. Always call this first before any other tool.")
    public String formatStartup(String developerName, String rawUpdate){

    String date = LocalDate.now()
            .format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        return String.format("👤 %s's Standup — %s\n\n%s",
                developerName, date, rawUpdate);    }

}
