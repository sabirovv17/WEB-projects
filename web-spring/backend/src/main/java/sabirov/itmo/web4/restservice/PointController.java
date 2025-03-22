package sabirov.itmo.web4.restservice;

import sabirov.itmo.web4.dao.service.PointService;
import sabirov.itmo.web4.dao.service.UserService;
import sabirov.itmo.web4.models.Point;
import sabirov.itmo.web4.models.User;
import sabirov.itmo.web4.models.comparator.PointComparatorByDate;
import sabirov.itmo.web4.network.response.PointResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import sabirov.itmo.web4.utils.Checker;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class PointController {
    @Autowired
    private UserService userService;
    @Autowired
    private PointService pointService;
    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @PostMapping("/get-points")
    public List<Point> getPoints(@RequestBody User user) {
        User userModel = userService.findByEmail(user.getEmail());
        return pointService.getPoints(userModel).stream().sorted(new PointComparatorByDate().reversed()).toList();
    }

    @PostMapping("/check-point")
    public Point check(@RequestBody PointResponse pointResponse) {
        long startTime = System.nanoTime();
        User userModel = userService.findByEmail(pointResponse.getEmail());
        boolean isHit = Checker.isHit(pointResponse.getX(), pointResponse.getY(), pointResponse.getR());
        try {
            Point point = new Point(pointResponse.getX(), pointResponse.getY(), pointResponse.getR(), isHit, Integer.valueOf(String.valueOf(System.nanoTime() - startTime)), formatter.format(LocalDateTime.now()), userModel);
            return pointService.save(point);
        } catch (Exception ignored) {
            return null;
        }
    }
}
