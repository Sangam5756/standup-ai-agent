package org.ailearn.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.ailearn.dtos.ApiResponse;
import org.ailearn.dtos.StandupUpdateRequest;
import org.ailearn.models.StandupEntry;
import org.ailearn.models.User;
import org.ailearn.services.StandupHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standup")
@AllArgsConstructor
public class HistoryController {

    private final StandupHistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<StandupEntry>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(historyService.getHistory(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StandupEntry>> getEntryById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return historyService.getEntryById(id, user)
                .map(entry -> ResponseEntity.ok(ApiResponse.success("Entry found", entry)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StandupEntry>> updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody StandupUpdateRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            StandupEntry updated = historyService.updateEntry(id, user, request);
            return ResponseEntity.ok(ApiResponse.success("Entry updated successfully", updated));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(ApiResponse.failure(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        try {
            historyService.deleteEntry(id, user);
            return ResponseEntity.ok(ApiResponse.success("Entry deleted successfully", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(ApiResponse.failure(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}