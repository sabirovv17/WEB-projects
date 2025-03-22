package sabirov.itmo.web4.dao.service;

import sabirov.itmo.web4.dao.repository.PointRepository;
import sabirov.itmo.web4.models.Point;
import sabirov.itmo.web4.models.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PointService {
    private final PointRepository pointRepository;

    public PointService(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    public Point save(Point point) {
        return pointRepository.save(point);
    }

    public ArrayList<Point> getPoints(User user) {
        return pointRepository.findAllByUser(user);
    }
}
