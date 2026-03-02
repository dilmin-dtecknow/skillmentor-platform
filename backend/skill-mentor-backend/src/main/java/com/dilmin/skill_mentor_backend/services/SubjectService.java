package com.dilmin.skill_mentor_backend.services;

import com.dilmin.skill_mentor_backend
        .entities.Subject;

import java.util.List;

public interface SubjectService {
    List<Subject> getAllSubjects();
    Subject addNewSubject(Long mentorId, Subject subject);
    Subject getSubjectById(Long id);
    Subject updateSubjectById(Long id, Subject updatedSubject);
    void deleteSubject(Long id);
}
