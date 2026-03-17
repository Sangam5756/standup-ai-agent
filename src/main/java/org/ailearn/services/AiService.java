package org.ailearn.services;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ailearn.dtos.AnswerResponse;
import org.ailearn.dtos.QuestionRequest;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class AiService {

    private final OpenAiChatModel chatModel;
    private final ObjectMapper objectMapper;

    private final String systemPrompt="""
            You are a helpful assistant. Always respond with ONLY valid JSON — no explanation,
            no markdown, no code fences. Use this exact structure:
            {
              "question": "<the user's question>",
              "answer": "<your answer here>",
              "confidence": "<high|medium|low>",
              "category": "<science|history|technology|general|other>"
            }
            """;

    public AnswerResponse generateAnswer(QuestionRequest questionRequest) {
        if (questionRequest == null || questionRequest.getQuestion() == null || questionRequest.getQuestion().isBlank()) {
            throw new IllegalArgumentException("Question cannot be null or empty");
        }

        String userPrompt = "Question: " + questionRequest.getQuestion();

        Prompt prompt = new Prompt(List.of(
                new SystemMessage(systemPrompt),
                new UserMessage(userPrompt)
        ));

        String response = chatModel.call(prompt)
                .getResult()
                .getOutput()
                .getText();

        if (response == null || response.isBlank()) {
            throw new RuntimeException("Empty response from AI model");
        }

        return objectMapper.readValue(response, AnswerResponse.class);
    }



}
