package org.ailearn.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ailearn.dtos.ApiResponse;
import org.ailearn.models.User;
import org.ailearn.services.WeeklySummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/standup")
@AllArgsConstructor
public class WeeklyController {

    private final WeeklySummaryService weeklySummaryService;

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<String>> getWeeklySummary(@AuthenticationPrincipal User user) {
        String summary = weeklySummaryService.getWeeklySummary(user);
        return ResponseEntity.ok(ApiResponse.success("Weekly summary retrieved", summary));
    }
}
