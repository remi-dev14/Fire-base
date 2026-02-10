package com.antananarivo.backend.service;

import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SyncService {
    private final ReportRepository reportRepository;

    public SyncService(ReportRepository reportRepository){
        this.reportRepository = reportRepository;
    }

    // Push a list of reports to Firebase (stubbed)
    public boolean pushSignalements(List<Report> reports){
        // TODO: implement Firebase REST push; currently stub that saves locally if needed
        for (Report r: reports){
            if (r.getId()==null) reportRepository.save(r);
        }
        return true;
    }

    // Pull signalements from Firebase (stubbed)
    public List<Report> pullSignalements(){
        // TODO: call Firebase and merge; currently return empty list
        return new ArrayList<>();
    }

    // Sync mobile users from Firebase (stubbed)
    public boolean syncMobileUsers(){
        // TODO: implement mobile users sync
        return true;
    }

    // Attempt to resolve conflicts between local and remote
    public boolean resolveConflicts(){
        // TODO: conflict resolution logic
        return true;
    }
}

