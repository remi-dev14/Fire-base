package com.antananarivo.backend.service;

import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatsService {
    private final ReportRepository reportRepository;
    private final ReportService reportService;

    public StatsService(ReportRepository reportRepository, ReportService reportService){
        this.reportRepository = reportRepository;
        this.reportService = reportService;
    }

    public long totalReports(){
        return reportRepository.count();
    }

    public double totalSurface(){
        double sum = 0.0;
        List<Report> all = reportRepository.findAll();
        for (Report r: all) if (r.getSurface()!=null) sum += r.getSurface();
        return sum;
    }

    public double totalBudget(){
        double sum = 0.0;
        List<Report> all = reportRepository.findAll();
        for (Report r: all) if (r.getBudget()!=null) sum += r.getBudget();
        return sum;
    }

    public double overallProgressPercent(){
        List<Report> all = reportRepository.findAll();
        if (all.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Report r: all) sum += reportService.progressForReport(r.getId());
        return sum / all.size();
    }

    public long averageResolutionSeconds(){
        return reportService.averageResolutionSeconds();
    }
}
