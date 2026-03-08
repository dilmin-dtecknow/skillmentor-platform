package com.dilmin.skill_mentor_backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class MentorProfileResponseDTO {
    private Long id;
    private String mentorId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String title;
    private String profession;
    private String company;
    private int experienceYears;
    private String bio;
    private String profileImageUrl;
    private Boolean isCertified;
    private String startYear;

    private Integer totalEnrollments;
    private Integer subjectsCount;
    private Integer reviewCount;
    private Double averageRating;
    private Integer positiveReviewPercentage;

    private List<SubjectProfileDTO> subjects;
    private List<ReviewDTO> reviews;
}
