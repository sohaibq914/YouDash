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
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers(
                    // User Controller endpoints
                    "auth/login",
                    "/api/users/login",
                    "auth/signup",
                    "/api/users/session",
                    "/api/users/logout",
                    "/api/users/signup",
                    "/api/users/google-login",
                    "/api/users/{id}",
                    "/api/users/{id}/recommendations-from-followers",
                    "/api/users/{id}/followers",
                    "/api/users/{id}/my-followers",
                    "/api/users/{id}/recommended-followers",
                    "/api/users/{followerId}/followers-of-follower",
                    "/api/users/{id}/recommended-followers-of-followers",
                    "/api/users/{id}/recommended-following",
                    "/api/users/{targetId}/follow/{currentUserId}",
                    "/api/users/{targetId}/unfollow/{currentUserId}",

                    // Goals Controller endpoints
                    "/goals/{user}/create",
                    "/goals/{user}/view",
                    "/goals/{user}/{timeFrame}/{timeFrameSelection}",
                    "/goals/{user}/{timeFrame}/{timeFrameSelection}/pie",
                    "/goals/{user}/{timeFrame}/{timeFrameSelection}/bar",
                    "/goals/{user}/edit",
                    "/goals/{user}/delete",
                    "/goals/{user}/recommended-similar-goals",
                    "/goals/{userId}/users-with-similar-goal-types",

                    // Profile Controller endpoints
                    "/profile/{userID}/updateProfile",
                    "/profile/{userID}/uploadProfilePicture",
                    "/profile/{userID}",
                    "/profile/darkmode",
                    "/profile/{userId}/full",

                    // Analytics Controller endpoints
                    "/analytics/{userId}/watch-time-by-hour",
                    "/analytics/{userId}/watch-time-by-hour-custom",

                    // Categories Controller endpoints
                    "/block-categories/{userID}/addCategory",
                    "/block-categories/{userID}/DeleteCategory",
                    "/block-categories/{userID}/availableCategories",
                    "/block-categories/{userID}/blockedCategories",
                    "/block-categories/{userID}/testGetBlockedCategories",
                    "/block-categories/{userID}/testAddBlockedCategory/{categoryName}",

                    // OpenAI Controller endpoints
                    "/ai/{userId}/recommendations",
                    "/ai/{userId}/prompt-history",
                    "/ai/reformat-message",

                    // Watch History Controller endpoints
                    "/watch-history/{userID}/historyList",
                    "/watch-history/{userID}/addVideo",
                    "/watch-history/{userID}/totalWatchTime",
                    "/watch-history/{userID}/watchTimeByCategory/{category}",

                    // YouTube API Controller endpoints
                    "/youtube/video-category",

                    "/auth/google-login",

                    // Other endpoints
                    "/api/message",
                    "/uploads/**",

                    // Messages
                    "/group-chat/groups/{groupId}/messages",
                    "/group-chat/groups/{groupId}/messages/{messageId}/vote",
                    "/group-chat/groups/{groupId}/messages/{messageId}/delete",
                    "/group-chat/isManager/{userId}/{groupId}",
                    "{userID}/group-chat",


                    "api/users/signup",
                    "/api/privacy/{userId}/pending-requests",
                    "/api/privacy/{userId}/handle-request",
                    "/api/privacy/{targetId}/follow-request",
                    "/api/privacy/{userID}/toggle",

                    //group endpoints
                        "/groups/{user}/create",
                        "/groups/{user}/edit",
                        "/groups/{user}/view",
                        "/groups/announcements/{groupId}",
                        "/groups/{userId}/announcement/{groupId}",
                        "/groups/{groupId}/announcements/{index}",
                        "/groups/{userId}/announcement/{groupId}/{index}",
                        "/groups/{userId}/all-announcements",
                        "/groups/{user}/rij",
                        "/groups/{user}/req",
                        "/groups/{user}/acc",
                        "/groups/{groupId}/viewgroup",
                        "/api/direct-messages/**",  // Allow all direct message endpoints
                        "/api/users/getAll",
                        "/api/users",
                        "/api/users/{userId}/block/{userId1}",
                        "/api/users/{userId}/unblock/{userId1}"

                ).permitAll()
                .anyRequest().authenticated()
            )

            .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Enable session creation
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

