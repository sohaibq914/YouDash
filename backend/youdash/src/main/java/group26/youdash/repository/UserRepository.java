package group26.youdash.repository;

import group26.youdash.model.User;

public interface UserRepository {
    User save(User user);
    User findById(int id);
    void delete(int id);
}
