package org.ailearn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class AnswerResponse {
    private String question;
    private String answer;
    private String confidence;
    private String category;
}
