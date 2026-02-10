package com.antananarivo.backend.controller;

import com.antananarivo.backend.model.Company;
import com.antananarivo.backend.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyRepository repo;
    public CompanyController(CompanyRepository repo){this.repo=repo;}

    @GetMapping
    public ResponseEntity<List<Company>> list(){
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<Company> create(@RequestBody Company c){
        return ResponseEntity.ok(repo.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable Long id, @RequestBody Company payload){
        return repo.findById(id).map(existing -> {
            if (payload.getName()!=null) existing.setName(payload.getName());
            if (payload.getSurface()!=null) existing.setSurface(payload.getSurface());
            if (payload.getBudget()!=null) existing.setBudget(payload.getBudget());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
