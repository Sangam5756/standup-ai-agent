package org.ailearn.tools;


import lombok.AllArgsConstructor;
import org.ailearn.models.StandupEntry;
import org.ailearn.repositories.StandupEntryRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DatabaseTool {
    private final StandupEntryRepository repository;

    @Tool(description = "Save the formatted standup to the database. Always call this last, after TelegramTool.")
    public String saveStandup(String developerName,String rawUpdate,String formattedStandup,Boolean telegramSent){
        try{

            repository.save(new StandupEntry(
                    developerName, rawUpdate, formattedStandup, telegramSent
            ));
            return "SUCCESS: standup saved to database";


        }catch(Exception e){
            return "FAILED: " + e.getMessage();

        }
    }

}
