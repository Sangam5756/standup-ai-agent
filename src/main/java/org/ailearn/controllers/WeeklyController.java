package org.ailearn.controllers;
import org.ailearn.services.WeeklySummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/standup")
public class WeeklyController {

    private final WeeklySummaryService weeklySummaryService;

    public WeeklyController(WeeklySummaryService weeklySummaryService) {
        this.weeklySummaryService = weeklySummaryService;
    }

    @GetMapping("/weekly")
    public ResponseEntity<String> getWeeklySummary() {
        return ResponseEntity.ok(weeklySummaryService.getWeeklySummary());
    }
}
