package org.ailearn.controllers;

import lombok.RequiredArgsConstructor;
import org.ailearn.models.User;
import org.ailearn.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/telegram/connect")
    public ResponseEntity<Map<String, String>> generateConnectCode(@AuthenticationPrincipal User user) {
        String code = userService.generateTelegramConnectCode(user);
        return ResponseEntity.ok(Map.of(
                "connectCode", code,
                "message", "Message your bot on Telegram with this code to connect your account. It expires in 15 minutes."
        ));
    }
}
