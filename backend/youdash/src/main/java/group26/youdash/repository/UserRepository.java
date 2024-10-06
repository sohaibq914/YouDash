package group26.youdash.repository;

import group26.youdash.model.User;

public interface UserRepository {

    /**
     * Save a user to the data store.
     * @param user The user object to save.
     * @return The saved user object.
     */
    User save(User user);

    /**
     * Find a user by their ID.
     * @param id The ID of the user to find.
     * @return The user object if found, otherwise null.
     */
    User findById(int id);

    /**
     * Delete a user by their ID.
     * @param id The ID of the user to delete.
     */
    void delete(int id);
}
