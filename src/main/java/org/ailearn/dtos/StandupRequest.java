package org.ailearn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class StandupRequest {
    String developerName;
    String rawUpdate;
}
