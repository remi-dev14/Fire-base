package com.antananarivo.backend.controller;

import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.model.StatusHistory;
import com.antananarivo.backend.repository.CompanyRepository;
import com.antananarivo.backend.repository.ReportRepository;
import com.antananarivo.backend.repository.StatusHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import com.antananarivo.backend.service.ReportService;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportRepository repo;
    private final CompanyRepository companyRepo;
    private final StatusHistoryRepository historyRepo;
    private final ReportService reportService;
    private final com.antananarivo.backend.service.NotificationService notificationService;

    public ReportController(ReportRepository repo, CompanyRepository companyRepo, StatusHistoryRepository historyRepo, ReportService reportService, com.antananarivo.backend.service.NotificationService notificationService){
        this.repo = repo; this.companyRepo = companyRepo; this.historyRepo = historyRepo; this.reportService = reportService; this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Report>> list(){
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> create(@RequestBody Report r){
        // basic validation
        if (r.getTitle() == null || r.getTitle().isBlank()) return ResponseEntity.badRequest().body("title is required");
        if (r.getSurface() == null || r.getSurface() < 0) return ResponseEntity.badRequest().body("surface invalid");
        if (r.getBudget() == null || r.getBudget() < 0) return ResponseEntity.badRequest().body("budget invalid");
        if (r.getCompany() != null && r.getCompany().getId() != null){
            companyRepo.findById(r.getCompany().getId()).ifPresent(r::setCompany);
        }
        r.setCreatedAt(OffsetDateTime.now());
        r.setUpdatedAt(OffsetDateTime.now());
        Report saved = repo.save(r);
        // record status history
    StatusHistory h = new StatusHistory(); h.setReportId(saved.getId()); h.setStatus(saved.getStatus()); h.setWhenSet(OffsetDateTime.now()); historyRepo.save(h);
    if (saved.getStatus()!=null) notificationService.notifyStatusChange(saved.getId(), saved.getStatus());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<Map<String,Object>> progress(@PathVariable Long id){
        int p = reportService.progressForReport(id);
        return ResponseEntity.ok(Map.of("reportId", id, "progress", p));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String,Object>> summary(){
        long avgSeconds = reportService.averageResolutionSeconds();
        // overall progress: average of individual progresses
        java.util.List<Report> all = repo.findAll();
        double sum = 0; for (Report r: all) sum += reportService.progressForReport(r.getId());
        double overall = all.isEmpty()?0: sum / all.size();
        return ResponseEntity.ok(Map.of("averageResolutionSeconds", avgSeconds, "overallProgressPercent", overall));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Report> update(@PathVariable Long id, @RequestBody Report payload){
        return repo.findById(id).map(existing -> {
            if (payload.getTitle() != null) existing.setTitle(payload.getTitle());
            if (payload.getDescription() != null) existing.setDescription(payload.getDescription());
            if (payload.getStatus() != null && !payload.getStatus().equals(existing.getStatus())){
                existing.setStatus(payload.getStatus());
                StatusHistory h = new StatusHistory(); h.setReportId(existing.getId()); h.setStatus(existing.getStatus()); h.setWhenSet(OffsetDateTime.now()); historyRepo.save(h);
                notificationService.notifyStatusChange(existing.getId(), existing.getStatus());
            }
            if (payload.getSurface() != null) existing.setSurface(payload.getSurface());
            if (payload.getBudget() != null) existing.setBudget(payload.getBudget());
            if (payload.getCompany() != null && payload.getCompany().getId() != null){
                companyRepo.findById(payload.getCompany().getId()).ifPresent(existing::setCompany);
            }
            existing.setUpdatedAt(OffsetDateTime.now());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> delete(@PathVariable Long id){
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
