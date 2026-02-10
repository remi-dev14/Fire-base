package com.antananarivo.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "text")
    private String description;
    private String status;
    private String author;
    private Double surface;
    private Double budget;
    @ManyToOne
    @JoinColumn(name = "company_id")
    private com.antananarivo.backend.model.Company company;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
    public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public String getAuthor(){return author;} public void setAuthor(String a){this.author=a;}
    public Double getSurface(){return surface;} public void setSurface(Double s){this.surface=s;}
    public Double getBudget(){return budget;} public void setBudget(Double b){this.budget=b;}
    public com.antananarivo.backend.model.Company getCompany(){return company;} public void setCompany(com.antananarivo.backend.model.Company c){this.company=c;}
    public OffsetDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(OffsetDateTime c){this.createdAt=c;}
    public OffsetDateTime getUpdatedAt(){return updatedAt;} public void setUpdatedAt(OffsetDateTime u){this.updatedAt=u;}
}
