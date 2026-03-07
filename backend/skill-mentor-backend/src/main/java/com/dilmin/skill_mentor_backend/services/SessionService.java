package com.dilmin.skill_mentor_backend.services;

import com.dilmin.skill_mentor_backend.dto.SessionDTO;
import com.dilmin.skill_mentor_backend.entities.Session;
import com.dilmin.skill_mentor_backend.security.UserPrincipal;

import java.util.List;

public interface SessionService {

    Session createNewSession(SessionDTO sessionDTO);
    List<Session> getAllSessions();
    Session getSessionById(Long id);
    Session updateSessionById(Long id, SessionDTO updatedSessionDTO);
    void deleteSession(Long id);

    // Frontend enrollment flow — student is resolved from the Clerk JWT
    Session enrollSession(UserPrincipal userPrincipal, SessionDTO sessionDTO);
    List<Session> getSessionsByStudentEmail(String email);

    Session confirmPayment(Long sessionId);

    Session markSessionCompleted(Long sessionId);

    Session addMeetingLink(Long sessionId, String meetingLink);
    Session addReview(Long sessionId, String review, Integer rating);
}
