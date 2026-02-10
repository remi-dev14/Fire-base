package com.antananarivo.backend.service;

import com.antananarivo.backend.model.User;
import com.antananarivo.backend.repository.UserRepository;
import com.antananarivo.backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Optional<String> loginLocal(String email, String password){
        User u = userRepository.findByEmailIgnoreCase(email);
        if (u == null) return Optional.empty();
        if (!passwordEncoder.matches(password, u.getPasswordHash())) return Optional.empty();
        return Optional.of(jwtUtil.generateToken(u.getEmail()));
    }

    public User createManagerDefault(){
        String adminEmail = "admin@example.com";
        User exist = userRepository.findByEmailIgnoreCase(adminEmail);
        if (exist != null) return exist;
        User u = new User();
        u.setEmail(adminEmail);
        u.setPasswordHash(passwordEncoder.encode("password"));
        u.setRole("MANAGER");
        u.setStatus("active");
        return userRepository.save(u);
    }

    public void blockUser(Long id){
        userRepository.findById(id).ifPresent(u->{u.setStatus("blocked"); userRepository.save(u);});
    }

    public void unblockUser(Long id){
        userRepository.findById(id).ifPresent(u->{u.setStatus("active"); userRepository.save(u);});
    }

    /**
     * Create a manager user with given email and password.
     * If a user with the email already exists, return it unchanged.
     */
    public User createManager(String email, String password){
        User exist = userRepository.findByEmailIgnoreCase(email);
        if (exist != null) return exist;
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setRole("MANAGER");
        u.setStatus("active");
        return userRepository.save(u);
    }
}
