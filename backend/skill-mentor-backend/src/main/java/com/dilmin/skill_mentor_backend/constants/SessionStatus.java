package com.dilmin.skill_mentor_backend.constants;

public enum SessionStatus {
    COMPLETED, IN_PROGRESS, FAILED,PENDING,scheduled;

    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_SCHEDULED = "scheduled";
}
