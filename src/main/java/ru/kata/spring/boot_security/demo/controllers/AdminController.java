package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        model.addAttribute("roles", roleService.findAll());
        return "admins/edit";
    }


    @PatchMapping("/{id}")
    public String update(@ModelAttribute("user") @Valid User user,BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admins/edit";
        }
        userService.update(user);
        return "redirect:/admin";
    }


    @GetMapping("/{id}/delete")
    public String drop(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        model.addAttribute("roles", roleService.findAll());
        return "admins/delete";
    }


    @DeleteMapping("/{id}")
    public String delete(@ModelAttribute("user") @Valid User user,BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admins/delete";
        }
        userService.deleteById(user.getId());
        return "redirect:/admin";
    }






}
