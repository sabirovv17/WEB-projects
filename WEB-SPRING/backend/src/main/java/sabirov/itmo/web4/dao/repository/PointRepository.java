package sabirov.itmo.web4.dao.repository;

import sabirov.itmo.web4.models.Point;
import sabirov.itmo.web4.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

// Point ManyToOne
public interface PointRepository extends JpaRepository<Point, Integer> {
    ArrayList<Point> findAllByUser(User user);
}
