package sabirov.itmo.web4.dao.service;

import sabirov.itmo.web4.dao.repository.UserRepository;
import sabirov.itmo.web4.models.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return (User) userRepository.findByEmail(email);
    }
}
