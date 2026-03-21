package org.ailearn.services;

import lombok.RequiredArgsConstructor;
import org.ailearn.dtos.StandupUpdateRequest;
import org.ailearn.models.StandupEntry;
import org.ailearn.models.User;
import org.ailearn.repositories.StandupEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StandupHistoryService {

    private final StandupEntryRepository repository;

    public List<StandupEntry> getHistory(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<StandupEntry> getHistory(User user, int limit) {
        return repository.findByUser(user, org.springframework.data.domain.PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    public Optional<StandupEntry> getEntryById(Long id, User user) {
        return repository.findById(id)
                .filter(entry -> entry.getUser().getId().equals(user.getId()));
    }

    public void deleteEntry(Long id, User user) {
        StandupEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You do not own this entry");
        }
        
        repository.delete(entry);
    }

    public StandupEntry updateEntry(Long id, User user, StandupUpdateRequest request) {
        StandupEntry entry = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found"));

        if (!entry.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You do not own this entry");
        }

        entry.setRawUpdate(request.getRawUpdate());
        entry.setFormattedStandup(request.getFormattedStandup());
        return repository.save(entry);
    }
}