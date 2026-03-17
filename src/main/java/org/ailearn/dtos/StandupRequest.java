package org.ailearn.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class StandupRequest {
    @NotBlank(message = "Developer name is required")
    @Size(message = "Developer name must be between 3 and 100 characters")
    String developerName;
    
    @NotBlank(message = "Raw update is required")
    @Size(max=2000,message = "Standup update is too long")
    String rawUpdate;
}
