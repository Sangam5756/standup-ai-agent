package org.ailearn.controllers;


import lombok.AllArgsConstructor;
import org.ailearn.dtos.QuestionRequest;
import org.ailearn.services.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@AllArgsConstructor
public class AiController {

    private final AiService aiService;
    @PostMapping
    public ResponseEntity<?> generateAnswer(@RequestBody QuestionRequest questionRequest) {

        return ResponseEntity.ok(aiService.generateAnswer(questionRequest));

    }

}
