package api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import api.model.user.User;


public interface UserRepository extends JpaRepository<User, Long> {
}