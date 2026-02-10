package com.antananarivo.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "report_status_history")
public class StatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reportId;
    private String status;
    private OffsetDateTime whenSet;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getReportId(){return reportId;} public void setReportId(Long r){this.reportId=r;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public OffsetDateTime getWhenSet(){return whenSet;} public void setWhenSet(OffsetDateTime w){this.whenSet=w;}
}
