package api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

import api.model.user.User;
import api.model.user.UserRecord;
import api.repository.UserRepository;

public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    public List<UserRecord> getAllProducts() {
        return this.userRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<UserRecord> getUserById(long id) {
        return this.userRepository
                .findById(id)
                .map(this::convertToDTO);
    }

    public UserRecord saveUser(UserRecord userRecord) {
        User user = convertToEntity(userRecord);
        user.setRole("USER");
        user.setPassword(PasswordEncoder.en);
        User savedUser = this.userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public void deleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    private User convertToEntity(UserRecord userRecord) {
        User user = new User();
        user.setId(userRecord.id());
        user.setNickname(userRecord.nickname());
        user.setEmail(userRecord.email());
        user.setPassword(userRecord.password());
        user.setRole(userRecord.role());
        user.setAvatar(userRecord.avatar());
        user.setBannedUntil(userRecord.bannedUntil());
        user.setBirthDate(userRecord.birthDate());
        user.setCreatedAt(userRecord.createdAt());
        user.setUpdatedAt(userRecord.updatedAt());
        return user;
    }

    private UserRecord convertToDTO(User user) {
        return new UserRecord(user.getId(), user.getNickname(), user.getEmail(), user.getPassword(), user.getRole(),
                user.getAvatar(), user.getBannedUntil(), user.getBirthDate(), user.getCreatedAt(), user.getUpdatedAt());
    }
}
