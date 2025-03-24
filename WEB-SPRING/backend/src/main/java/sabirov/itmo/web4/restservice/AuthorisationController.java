package sabirov.itmo.web4.restservice;


import sabirov.itmo.web4.dao.service.UserService;
import sabirov.itmo.web4.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthorisationController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        User userModel = userService.findByEmail(user.getEmail());
        if (userModel == null) {
            user.setLogin(false);
        } else {
            user.setPassword(String.valueOf(user.getPassword().hashCode()));
            user.setLogin(userModel.getPassword().equals(user.getPassword()));
        }
        return user;
    }

    @PostMapping("/registration")
    public User registration(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()) == null){
            user.setPassword(String.valueOf(user.getPassword().hashCode()));
            userService.createUser(user);
            user.setLogin(true);
        } else user.setLogin(false);
        return user;
    }
}
