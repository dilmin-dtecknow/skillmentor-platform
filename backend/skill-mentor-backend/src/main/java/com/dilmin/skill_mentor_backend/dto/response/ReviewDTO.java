package com.dilmin.skill_mentor_backend.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewDTO {
    private Integer sessionId;
    private String studentName;
    private String review;
    private Integer rating;
    private Date sessionAt;
}
