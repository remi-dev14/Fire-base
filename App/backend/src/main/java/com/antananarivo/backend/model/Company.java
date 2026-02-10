package com.antananarivo.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double surface;
    private Double budget;
    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public Double getSurface(){return surface;} public void setSurface(Double s){this.surface=s;}
    public Double getBudget(){return budget;} public void setBudget(Double b){this.budget=b;}
}
