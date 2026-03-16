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

// to get the entries for last 7 days for summary purpose
    @Query("Select s from StandupEntry s where s.createdAt >= :since order by s.createdAt ASC")
    List<StandupEntry> findEntriesSince(LocalDateTime since);
}
