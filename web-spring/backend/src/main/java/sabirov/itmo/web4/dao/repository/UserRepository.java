package sabirov.itmo.web4.dao.repository;

import sabirov.itmo.web4.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}
