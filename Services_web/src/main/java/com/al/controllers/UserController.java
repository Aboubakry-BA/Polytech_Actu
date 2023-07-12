package com.al.controllers;

import com.al.models.Auth;
import com.al.models.User;
import com.al.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users/login")
    public ResponseEntity<User> authentifierUtilisateur(@RequestBody Auth auth){
        User user = userService.authentifierUtilisateur(auth.getLogin(), auth.getMotDePasse());
        if (user != null){
            userService.modifierUtilisateur(user);
            user.setMotDePasse(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}
