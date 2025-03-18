package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(final UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public String admin(Model model) {
        model.addAttribute("users", userService.findAll());
        return "admins/admin";
    }


    @GetMapping("/new")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.findAll());
        return "admins/new";
    }

    @PostMapping("/new")
    public String create(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admins/new";
        }
        userService.save(user);
        return "redirect:/admin";
    }


    @GetMapping("/edit")
    public String edit(@ModelAttribute("id") Long id, Model model) {
        model.addAttribute("id", id);
        model.addAttribute("user", userService.findById(id));
        model.addAttribute("roles", roleService.findAll());
        return "admins/edit";
    }

    @PostMapping("/edit")
    public String update(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admins/edit";
        }
        userService.update(user);
        return "redirect:/admin";
    }



    @GetMapping("/delete")
    public String drop(@ModelAttribute("id") Long id, Model model, User user) {
        model.addAttribute("id", id);
        model.addAttribute("user", user);
        model.addAttribute("users", userService.findById(id));
        return "admins/delete";
    }

    @PostMapping("/delete")
    public String delete(@ModelAttribute("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }
}
