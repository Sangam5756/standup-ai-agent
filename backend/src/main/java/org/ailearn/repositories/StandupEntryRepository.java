package org.ailearn.repositories;


import org.ailearn.models.StandupEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StandupEntryRepository extends JpaRepository<StandupEntry, Long>
{

    //for getting all the history
    List<StandupEntry> findAllByOrderByCreatedAtDesc();

    List<StandupEntry> findByUserOrderByCreatedAtDesc(org.ailearn.models.User user);

// to get the entries for last 7 days for summary purpose
    @Query("Select s from StandupEntry s where s.user = :user and s.createdAt >= :since order by s.createdAt ASC")
    List<StandupEntry> findEntriesSince(org.ailearn.models.User user, LocalDateTime since);
}
