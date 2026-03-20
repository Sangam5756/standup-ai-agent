package org.ailearn.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.ailearn.dtos.ApiResponse;
import org.ailearn.dtos.StandupRequest;
import org.ailearn.services.StandupAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.ailearn.models.User;

@RestController
@RequestMapping("/api/standup")
@AllArgsConstructor
public class StandupController {
    private final StandupAgentService agentService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitStandup(
            @Valid @RequestBody StandupRequest request,
            @AuthenticationPrincipal User user
    ) {
        String result = agentService.generateAndPost(request, user);
        return ResponseEntity.ok(ApiResponse.success("Standup processed", result));
    }
}
