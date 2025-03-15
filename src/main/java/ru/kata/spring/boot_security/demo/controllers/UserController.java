package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;


@Controller
@RequestMapping("/")
public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("users", userService.findAll());
        return "admin";
    }

    @GetMapping("/admin/new")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        return "new";
    }

    @PostMapping("/admin/new")
    public String create(@ModelAttribute("user") @Valid User user, Role role,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/new";
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit")
    public String edit(@ModelAttribute("id") Long id, Model model) {
        model.addAttribute("id", id);
        model.addAttribute("user", userService.findById(id));
        return "edit";
    }

    @PostMapping("/admin/edit")
    public String update(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "edit";
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/delete")
    public String drop(@ModelAttribute("id") Long id, Model model, User user) {
        model.addAttribute("id", id);
        model.addAttribute("user", user);
        model.addAttribute("users", userService.findById(id));
        return "delete";
    }

    @PostMapping("/admin/delete")
    public String delete(@ModelAttribute("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }


    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String create(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/register";
        }
        userService.save(user);
        return "redirect:/login";
    }


    @GetMapping("user")
    public String user(Model model, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username);
        model.addAttribute("user", user);
        return "user";

    }
}
