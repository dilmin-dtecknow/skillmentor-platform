package com.dilmin.skill_mentor_backend.services;

import com.dilmin.skill_mentor_backend.entities.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MentorService {
    Mentor createNewMentor(Mentor mentor);
    Page<Mentor> getAllMentors(String name, Pageable pageable);
    Mentor getMentorById(Long id);
    Mentor updateMentorById(Long id, Mentor updatedMentor);
    void deleteMentor(Long id);
}
