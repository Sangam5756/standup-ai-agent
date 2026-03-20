package org.ailearn.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StandupRequest {
    @NotBlank(message = "Raw update is required")
    @Size(min = 10, message = "Update is too short — add more detail")
    @Size(max = 2000, message = "Standup update is too long")
    String rawUpdate;
}
