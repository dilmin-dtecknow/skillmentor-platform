package com.dilmin.skill_mentor_backend.respositories;

import com.dilmin.skill_mentor_backend.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject,Long> {

    // custom queries
}
