package com.antananarivo.backend.security;

import com.antananarivo.backend.model.User;
import com.antananarivo.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository){
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")){
            String token = auth.substring(7);
            if (!jwtUtil.validateToken(token)){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            String subject = jwtUtil.getSubjectFromToken(token);
            if (subject == null){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            User u = userRepository.findByEmailIgnoreCase(subject);
            if (u == null || !"active".equalsIgnoreCase(u.getStatus())){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            String role = u.getRole()!=null?u.getRole():"USER";
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(subject, null, List.of(new SimpleGrantedAuthority("ROLE_"+role)));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
