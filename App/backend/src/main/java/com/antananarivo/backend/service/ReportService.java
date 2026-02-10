package com.antananarivo.backend.service;

import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.model.StatusHistory;
import com.antananarivo.backend.repository.ReportRepository;
import com.antananarivo.backend.repository.StatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final StatusHistoryRepository historyRepository;

    public ReportService(ReportRepository reportRepository, StatusHistoryRepository historyRepository){
        this.reportRepository = reportRepository;
        this.historyRepository = historyRepository;
    }

    // per-report progress: map status -> progress value
    public int progressForReport(Long reportId){
        Report r = reportRepository.findById(reportId).orElse(null);
        if (r==null) return 0;
        String s = r.getStatus();
        if (s==null) return 0;
        return mapStatusToProgress(s);
    }

    private int mapStatusToProgress(String s){
        if (s == null) return 0;
        String norm = s.toLowerCase();
        if (norm.equals("nouveau") || norm.equals("new")) return 0;
        if (norm.equals("en_cours") || norm.equals("in_progress") || norm.equals("inprogress")) return 50;
        if (norm.equals("termine") || norm.equals("done") || norm.equals("completed")) return 100;
        return 0;
    }

    // global average resolution time: average time from first status to a 'termine' status
    public long averageResolutionSeconds(){
        List<Report> all = reportRepository.findAll();
        long totalSeconds = 0; int count = 0;
        for (Report r: all){
            List<StatusHistory> events = historyRepository.findByReportIdOrderByWhenSetAsc(r.getId());
            OffsetDateTime start = null; OffsetDateTime end = null;
            for (StatusHistory e: events){
                if (start==null) start = e.getWhenSet();
                if (e.getStatus()!=null && (e.getStatus().equalsIgnoreCase("termine")||e.getStatus().equalsIgnoreCase("done")||e.getStatus().equalsIgnoreCase("completed"))){
                    end = e.getWhenSet();
                    break;
                }
            }
            if (start!=null && end!=null){
                totalSeconds += Duration.between(start,end).getSeconds();
                count++;
            }
        }
        return count==0?0: totalSeconds/count;
    }
}
