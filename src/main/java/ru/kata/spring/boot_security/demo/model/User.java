package ru.kata.spring.boot_security.demo.model;



import org.hibernate.annotations.Cascade;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;


    @NotEmpty(message = "Имя не должно быть пустым")
    @Size(min = 2,max = 40,message = "Имя должно быть от 2 до 40 символов!")
    @Column(name = "username", nullable = false, unique = true)

    private String username;

    @Column(name = "last_name")
    @NotEmpty(message = "Фамилия не должна быть пустой")
    @Size(min = 2,max = 40,message = "Фамилия должна быть от 2 до 40 символов!")
    private String lastName;


    @NotEmpty(message = "Пароль не должен быть пустым")
    @Size(min = 5,max = 60,message = "Пароль должен быть от 5 до 40 символов")
    @Column(name = "password")
    private String password;

    @Column(name = "age")
    @Min(value = 0,message = "Возраст должен быть больше чем 0")
    private int age;

    @Column(name = "email")
    @Size(min = 2,max = 40,message = "Почта должна быть от 2 до 40 символов!")
    private String email;


    @Column(name = "city")
    @NotEmpty(message = "Поле Город не должно быть пустым")
    @Size(min = 2,max = 40,message = "Название города должно быть от 2 до 40 символов!")
    private String city;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Cascade({org.hibernate.annotations.CascadeType.PERSIST, org.hibernate.annotations.CascadeType.REFRESH})
    private List<Role> roles;

    public User() {
    }

    public User(String username, String lastName, String password, int age, String email, String city, List<Role> roles) {
        this.username = username;
        this.lastName = lastName;
        this.password = password;
        this.age = age;
        this.email = email;
        this.city = city;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMyUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMyPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public  String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(@Min(value = 0, message = "Возраст должен быть больше чем 0") int age) {
        this.age = age;
    }

    public @NotEmpty(message = "Поле Город не должно быть пустым") @Size(min = 2, max = 40, message = "Название города должно быть от 2 до 40 символов!") String getCity() {
        return city;
    }

    public void setCity(@NotEmpty(message = "Поле Город не должно быть пустым") @Size(min = 2, max = 40, message = "Название города должно быть от 2 до 40 символов!") String city) {
        this.city = city;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return getMyPassword();
    }

    @Override
    public String getUsername() {
        return getMyUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
