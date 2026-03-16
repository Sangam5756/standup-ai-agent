package org.ailearn.controllers;
import org.ailearn.models.StandupEntry;
import org.ailearn.services.StandupHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/standup")
public class HistoryController {

    private final StandupHistoryService historyService;
    public HistoryController(StandupHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        return ResponseEntity.ok(historyService.getHistory());
    }
}