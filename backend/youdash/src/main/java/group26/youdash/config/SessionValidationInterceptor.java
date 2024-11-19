package group26.youdash.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionValidationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Get the session
        HttpSession session = request.getSession(false); // Don't create a session if it doesn't exist
        String requestURI = request.getRequestURI();

        // Allow public routes (e.g., login and signup)
        if (requestURI.startsWith("/auth") || requestURI.startsWith("/public")) {
            return true; // Allow these routes without checking session
        }

        // Validate session
        Integer userId = (session != null) ? (Integer) session.getAttribute("userId") : null;
        if (userId == null) {
            // User is not logged in
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized access");
            return false; // Stop further processing
        }

        return true; // Allow the request to proceed
    }
}