package api.seeder;

import java.time.LocalDateTime;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import api.model.user.User;
import api.repository.UserRepository;
import net.datafaker.Faker;

@Component
public class DataLoader implements CommandLineRunner {

    private UserRepository userRepository;

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (this.userRepository.count() >= 100) {
            return;
        }

        User userTest = new User();
        userTest.setNickname("test");
        userTest.setEmail("test@gmail.com");
        userTest.setPassword("test");
        userTest.setRole("ROLE_USER");
        userTest.setCreatedAt(LocalDateTime.now());

        this.userRepository.save(userTest);

        Faker faker = new Faker();
        IntStream.range(0, 100).forEach(i -> {
            String nickname = faker.internet().username();
            String email = faker.internet().emailAddress();
            String password = faker.internet().uuid();
            String role = "ROLE_USER";

            User user = new User();
            user.setNickname(nickname);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            user.setCreatedAt(LocalDateTime.now());

            userTest.getSubscribers().add(user);
            if (i % 2 == 0) {
                user.getSubscribers().add(userTest);
            }
            this.userRepository.save(user);
        });
        this.userRepository.save(userTest);

        System.out.println("Generate 100 rando users");
    }
}
