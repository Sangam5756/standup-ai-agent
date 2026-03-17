package org.ailearn.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ailearn.dtos.ApiResponse;
import org.ailearn.services.WeeklySummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/standup")
@AllArgsConstructor
public class WeeklyController {

    private final WeeklySummaryService weeklySummaryService;



    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<String>> getWeeklySummary() {
        String summary = weeklySummaryService.getWeeklySummary();
        return ResponseEntity.ok(ApiResponse.success("Weekly summary retrieved", summary));
    }
}
