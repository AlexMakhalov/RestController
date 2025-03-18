package ru.kata.spring.boot_security.demo.services;

import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    @Query("Select u from User u left join fetch u.roles where u.username=:username")
    User findByUsername(String username);
    List<User> findAll();
    void save(User user);
    User findById(Long id);
    void deleteById (Long id);
    void update(User user);


}
