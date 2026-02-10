package com.antananarivo.backend;

import com.antananarivo.backend.model.Company;
import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.repository.CompanyRepository;
import com.antananarivo.backend.repository.ReportRepository;
import com.antananarivo.backend.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class DbInitRunner implements CommandLineRunner {
    private final AuthService authService;
    private final ReportRepository reportRepository;
    private final CompanyRepository companyRepository;

    public DbInitRunner(AuthService authService, ReportRepository reportRepository, CompanyRepository companyRepository){
        this.authService = authService;
        this.reportRepository = reportRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        authService.createManagerDefault();
        if (reportRepository.count()==0){
            Report r = new Report();
            r.setTitle("Exemple de signalement");
            r.setDescription("Ceci est un signalement seed");
            r.setAuthor("seed");
            r.setStatus("open");
            r.setCreatedAt(OffsetDateTime.now());
            reportRepository.save(r);
        }
        if (companyRepository.count()==0){
            Company c = new Company();
            c.setName("Entreprise Seed");
            c.setSurface(120.0);
            c.setBudget(50000.0);
            companyRepository.save(c);
        }
    }
}
