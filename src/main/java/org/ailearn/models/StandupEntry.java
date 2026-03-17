package org.ailearn.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "standup_entries")
@Setter
@Getter
@NoArgsConstructor

public class StandupEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Developer name is required")
    @Size(message = "Developer name must be between 3 and 100 characters")
    @Column(name = "developer_name", nullable = false, length = 100)
    private String developerName;

    @NotBlank(message = "Raw update is required")
    @Size(max=2000,message = "Standup update is too long")
    @Column(name = "raw_update", columnDefinition = "TEXT")
    private String rawUpdate;


    @Column(name = "formatted_standup", columnDefinition = "TEXT")
    private String formattedStandup;

    @Column(name = "telegram_sent")
    private Boolean telegramSent = false;


    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;



    public StandupEntry(String developerName, String rawUpdate, String formattedStandup, Boolean telegramSent) {
        this.developerName = developerName;
        this.rawUpdate = rawUpdate;
        this.formattedStandup = formattedStandup;
        this.telegramSent = telegramSent;
    }
}
