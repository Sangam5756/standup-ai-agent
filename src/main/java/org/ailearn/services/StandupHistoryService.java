package org.ailearn.services;

import org.ailearn.models.StandupEntry;
import org.ailearn.repositories.StandupEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class StandupHistoryService {

    private final StandupEntryRepository repository;

    public StandupHistoryService(StandupEntryRepository repository) {
        this.repository = repository;
    }

    public List<StandupEntry> getHistory() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}