package group26.youdash.model;

/**
 * LoginRequest represents the data required for user login.
 * It contains the username and password needed for authentication.
 *
 * Author: Abdul Wajid Arikattayil
 */
public class LoginRequest {

    // Username for user authentication
    private String username;

    // Password for user authentication
    private String password;

    /**
     * Retrieves the username.
     *
     * @return The username.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username.
     *
     * @param username The username to set.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Retrieves the password.
     *
     * @return The password.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password.
     *
     * @param password The password to set.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return "password" + password + " " + username;
    }
}
