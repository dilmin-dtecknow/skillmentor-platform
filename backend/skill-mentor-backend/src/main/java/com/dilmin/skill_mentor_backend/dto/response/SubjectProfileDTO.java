package com.dilmin.skill_mentor_backend.dto.response;

import lombok.Data;

@Data
public class SubjectProfileDTO {
    private Long id;
    private String subjectName;
    private String description;
    private String courseImageUrl;
    private Integer enrollmentCount;
}
