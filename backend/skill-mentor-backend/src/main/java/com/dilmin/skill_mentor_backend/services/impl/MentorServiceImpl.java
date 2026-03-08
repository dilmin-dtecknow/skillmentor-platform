package com.dilmin.skill_mentor_backend.services.impl;

import com.dilmin.skill_mentor_backend.dto.response.MentorProfileResponseDTO;
import com.dilmin.skill_mentor_backend.dto.response.ReviewDTO;
import com.dilmin.skill_mentor_backend.dto.response.SubjectProfileDTO;
import com.dilmin.skill_mentor_backend.entities.Mentor;
import com.dilmin.skill_mentor_backend.exceptions.SkillMentorException;
import com.dilmin.skill_mentor_backend.respositories.MentorRepository;
import com.dilmin.skill_mentor_backend.services.MentorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final ModelMapper modelMapper;

    @CacheEvict(value = "mentors", allEntries = true)
    public Mentor createNewMentor(Mentor mentor) {
        try {
            return mentorRepository.save(mentor);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating mentor: {}", e.getMessage());
            throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create new mentor", exception);
            throw new SkillMentorException("Failed to create new mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Cacheable(value = "mentors", key = "(#name ?: '') + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Mentor> getAllMentors(String name, Pageable pageable) {
        try {
            log.debug("getting mentors with name: {}", name);
            if (name != null && !name.isEmpty()) {
                return mentorRepository.findByName(name, pageable);
            }
            return mentorRepository.findAll(pageable); // SELECT * FROM mentor
        } catch (Exception exception) {
            log.error("Failed to get all mentors", exception);
            throw new SkillMentorException("Failed to get all mentors", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Cacheable(value = "mentors", key = "#id")
    public Mentor getMentorById(Long id) {
        try {

            Mentor mentor = mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );
            log.info("Successfully fetched mentor {}", id);
            return mentor;
        } catch (SkillMentorException skillMentorException) {
            //System.err.println("Mentor not found " + skillMentorException.getMessage());
            // LOG LEVELS
            // DEBUG, INFO, WARN, ERROR
            // env - dev, prod
            log.warn("Mentor not found with id: {} to fetch", id, skillMentorException);
            throw new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            log.error("Error getting mentor", exception);
            throw new SkillMentorException("Failed to get mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CacheEvict(value = "mentors", allEntries = true)
    public Mentor updateMentorById(Long id, Mentor updatedMentor) {
        try {
            Mentor mentor = mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );
            modelMapper.map(updatedMentor, mentor);
            return mentorRepository.save(mentor);
        } catch (SkillMentorException skillMentorException) {
            log.warn("Mentor not found with id: {} to update", id, skillMentorException);
            throw new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            log.error("Error updating mentor", exception);
            throw new SkillMentorException("Failed to update mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public void deleteMentor(Long id) {
        try {
            mentorRepository.deleteById(id);
        } catch (Exception exception) {
            log.error("Failed to delete mentor with id {}", id, exception);
            throw new SkillMentorException("Failed to delete mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public MentorProfileResponseDTO getMentorProfileById(Long id) {
        Mentor mentor = mentorRepository.findById(id).orElseThrow(
                () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
        );

        MentorProfileResponseDTO dto = new MentorProfileResponseDTO();
        dto.setId(mentor.getId());
        dto.setMentorId(mentor.getMentorId());
        dto.setFirstName(mentor.getFirstName());
        dto.setLastName(mentor.getLastName());
        dto.setEmail(mentor.getEmail());
        dto.setPhoneNumber(mentor.getPhoneNumber());
        dto.setTitle(mentor.getTitle());
        dto.setProfession(mentor.getProfession());
        dto.setCompany(mentor.getCompany());
        dto.setExperienceYears(mentor.getExperienceYears());
        dto.setBio(mentor.getBio());
        dto.setProfileImageUrl(mentor.getProfileImageUrl());
        dto.setIsCertified(mentor.getIsCertified());
        dto.setStartYear(mentor.getStartYear());

        int subjectsCount = mentor.getSubjects() == null ? 0 : mentor.getSubjects().size();
        dto.setSubjectsCount(subjectsCount);

        int totalEnrollments = mentor.getSessions() == null ? 0 : mentor.getSessions().size();
        dto.setTotalEnrollments(totalEnrollments);

        var reviews = mentor.getSessions() == null ? java.util.Collections.<ReviewDTO>emptyList()
                : mentor.getSessions().stream()
                .filter(s -> s.getStudentRating() != null)
                .map(s -> {
                    ReviewDTO reviewDTO = new ReviewDTO();
                    reviewDTO.setSessionId(s.getId());
                    reviewDTO.setStudentName(
                            s.getStudent().getFirstName() + " " + s.getStudent().getLastName()
                    );
                    reviewDTO.setReview(s.getStudentReview());
                    reviewDTO.setRating(s.getStudentRating());
                    reviewDTO.setSessionAt(s.getSessionAt());
                    return reviewDTO;
                }).toList();

        dto.setReviews(reviews);
        dto.setReviewCount(reviews.size());

        double averageRating = reviews.stream()
                .mapToInt(ReviewDTO::getRating)
                .average()
                .orElse(0.0);
        dto.setAverageRating(averageRating);

        int positiveCount = (int) reviews.stream()
                .filter(r -> r.getRating() != null && r.getRating() >= 4)
                .count();

        int positivePercentage = reviews.isEmpty() ? 0 : (positiveCount * 100) / reviews.size();
        dto.setPositiveReviewPercentage(positivePercentage);

        var subjectDtos = mentor.getSubjects() == null ? java.util.Collections.<SubjectProfileDTO>emptyList()
                : mentor.getSubjects().stream().map(subject -> {
            SubjectProfileDTO subjectDTO = new SubjectProfileDTO();
            subjectDTO.setId(subject.getId());
            subjectDTO.setSubjectName(subject.getSubjectName());
            subjectDTO.setDescription(subject.getDescription());
            subjectDTO.setCourseImageUrl(subject.getCourseImageUrl());
            subjectDTO.setEnrollmentCount(
                    subject.getSessions() == null ? 0 : subject.getSessions().size()
            );
            return subjectDTO;
        }).toList();

        dto.setSubjects(subjectDtos);

        return dto;
    }

}
