package group26.youdash.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    "/api/users/login", 
                    "/api/users/signup", 
                    "/api/users/google-login",
                    "/goals/{userId}/pie",
                    "/goals/{userId}/view",
                    "/goals/{userId}/create",
                    "/goals/{userId}/edit",
                    "/goals/{userId}/delete",
                    "/analytics/{userId}/watch-time-by-hour",
                    "/block-categories/{userID}/addCategory",
                    "/block-categories/{userID}/DeleteCategory",
                    "/block-categories/{userID}/availableCategories",
                    "/block-categories/{userID}/blockedCategories",
                    "/block-categories/{userID}/testGetBlockedCategories",
                    "/block-categories/{userID}/testAddBlockedCategory/{categoryName}",
                    "/ai/{userId}/recommendations",
                    "/ai/{userId}/prompt-history",
                    "/profile/{userID}/updateProfile",
                    "/profile/{userID}/uploadProfilePicture",
                    "/profile/{userID}",
                    "/profile/darkmode",
                    "/profile/{userId}/full",
                    "/watch-history/{userID}/historyList",
                    "/watch-history/{userID}/addVideo",
                    "/watch-history/{userID}/totalWatchTime",
                    "/watch-history/{userID}/watchTimeByCategory/{category}",
                    "/youtube/video-category",
                    "/api/message", 
                    "/profile/darkmode", 
                    "/uploads/**",
                    "/profile/{userId}/full"  // Add this line
                ).permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .frameOptions().disable()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}