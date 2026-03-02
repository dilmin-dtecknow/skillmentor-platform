package com.dilmin.skill_mentor_backend.controllers;

import com.dilmin.skill_mentor_backend.dto.SubjectDTO;
import com.dilmin.skill_mentor_backend.entities.Subject;
import com.dilmin.skill_mentor_backend.services.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/subjects")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class SubjectController {

    private final ModelMapper modelMapper;
    private final SubjectService subjectService;

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("{id}")
    public Subject getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

//    @PostMapping
//    public Subject createSubject(@Valid @RequestBody Subject subject) {
//        Long mentorId = 1L;
//
//        // check validation
//        if(subject.getSubjectName().length() < 3){
//            return null;
//        }
//        return subjectService.addNewSubject(mentorId, subject);
//    }

    @PostMapping
    public Subject createSubject(@Valid @RequestBody SubjectDTO subjectDTO) {
        Subject subject = modelMapper.map(subjectDTO, Subject.class);
        return subjectService.addNewSubject(subjectDTO.getMentorId(), subject);
    }

    @PutMapping("{id}")
    public Subject updateSubject(@PathVariable Long id, @RequestBody SubjectDTO updatedSubjectDTO) {
        Subject subject = modelMapper.map(updatedSubjectDTO, Subject.class);
        return subjectService.updateSubjectById(id, subject);
    }

    @DeleteMapping("{id}")
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}
