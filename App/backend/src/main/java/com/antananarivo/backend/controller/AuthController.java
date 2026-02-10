package com.antananarivo.backend.controller;

import com.antananarivo.backend.service.AuthService;
import com.antananarivo.backend.repository.UserRepository;
import com.antananarivo.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository){
        this.authService=authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String email = body.get("email");
        String password = body.get("password");
        return authService.loginLocal(email,password).map(token->{
            // include minimal user info in response so frontend can set role
            User u = userRepository.findByEmailIgnoreCase(email);
            Map<String,Object> userMap = Map.of(
                "id", u!=null?u.getId():null,
                "email", u!=null?u.getEmail():email,
                "role", u!=null?u.getRole():"USER"
            );
            return ResponseEntity.ok(Map.of("token",token, "user", userMap));
        }).orElse(ResponseEntity.status(401).body(Map.of("error","invalid")));
    }

    @PostMapping("/create-manager")
    public ResponseEntity<?> createManager(@RequestBody Map<String,String> body){
        String email = body.get("email");
        String password = body.get("password");
        if (email==null || password==null || email.isBlank() || password.isBlank()){
            return ResponseEntity.badRequest().body(Map.of("error","email and password required"));
        }
        User u = authService.createManager(email.trim().toLowerCase(), password);
        Map<String,Object> userMap = Map.of(
            "id", u.getId(),
            "email", u.getEmail(),
            "role", u.getRole()
        );
        return ResponseEntity.ok(Map.of("user", userMap));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(){
        return ResponseEntity.ok(Map.of("service","auth","status","ok"));
    }
}
