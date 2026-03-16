package org.ailearn.controllers;

import lombok.AllArgsConstructor;
import org.ailearn.dtos.StandupRequest;
import org.ailearn.services.StandupAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/standup")
@AllArgsConstructor
public class StandupController {
    private final StandupAgentService agentService;

    @PostMapping
    public ResponseEntity<String> submitStandup(@RequestBody StandupRequest request) {
        String result = agentService.generateAndPost(request);
        return ResponseEntity.ok(result);
    }

}
