package org.ailearn.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StandupUpdateRequest {
    @NotBlank(message = "Raw update is required")
    private String rawUpdate;
    
    @NotBlank(message = "Formatted standup is required")
    private String formattedStandup;
}
