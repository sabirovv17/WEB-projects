package sabirov.itmo.web4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "sabirov.itmo.web4.models")  // пакет с сущностями
@EnableJpaRepositories(basePackages = "sabirov.itmo.web4.dao.repository")
public class Web4Application {
	public static void main(String[] args) {
		SpringApplication.run(Web4Application.class, args);
	}
}
