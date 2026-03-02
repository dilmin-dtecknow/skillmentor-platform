package com.dilmin.skill_mentor_backend.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SkillMentorException extends RuntimeException {
    private final HttpStatus status;

    public SkillMentorException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}