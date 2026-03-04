package com.dilmin.skill_mentor_backend.respositories;

import com.dilmin.skill_mentor_backend.entities.Mentor;
import com.dilmin.skill_mentor_backend.entities.Session;
import com.dilmin.skill_mentor_backend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
    List<Session> findByStudent_Email(String email);
    boolean existsByStudentAndMentorAndSessionAt(
            Student student,
            Mentor mentor,
            Date sessionAt
    );
}
