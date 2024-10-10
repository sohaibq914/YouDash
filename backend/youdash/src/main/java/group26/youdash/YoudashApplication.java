package group26.youdash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import group26.youdash.service.FileStorageService;

@SpringBootApplication
public class YoudashApplication {

	

	public static void main(String[] args) {
		SpringApplication.run(YoudashApplication.class, args);
	}


	

	@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
