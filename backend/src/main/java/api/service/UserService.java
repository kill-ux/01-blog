package api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import api.model.user.LoginRequest;
import api.model.user.User;
import api.model.user.UserRecord;
import api.repository.UserRepository;
import jakarta.validation.Valid;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    public List<UserRecord> getAllUsers() {
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

    public UserRecord saveUser(@Valid UserRecord userRecord) {

        User user = convertToEntity(userRecord);
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        User savedUser;
        try {
            savedUser = this.userRepository.save(user);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            String err = "Data conflict - please check your input";
            if (errorMessage.contains("nickname") && errorMessage.contains("unique")) {
                err = "Username already exists";
            } else if (errorMessage.contains("email") && errorMessage.contains("unique")) {
                err = "Email already registered";
            }
            throw new IllegalStateException(err);
        }
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

    public User authenticate(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.nickname(), loginRequest.password()));
        return userRepository.findByNickname(loginRequest.nickname()).orElseThrow();
    }
}
