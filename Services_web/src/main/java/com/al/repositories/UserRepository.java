package com.al.repositories;

import com.al.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByLoginAndMotDePasse(String login, String motDepasse);
}
