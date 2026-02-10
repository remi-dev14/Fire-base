package com.antananarivo.backend.controller;

import com.antananarivo.backend.model.Report;
import com.antananarivo.backend.service.SyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
public class SyncController {
    private final SyncService syncService;
    public SyncController(SyncService syncService){this.syncService = syncService;}

    @PostMapping("/push")
    public ResponseEntity<?> push(@RequestBody List<Report> reports){
        boolean ok = syncService.pushSignalements(reports);
        return ResponseEntity.ok().body(java.util.Map.of("ok", ok));
    }

    @GetMapping("/pull")
    public ResponseEntity<List<Report>> pull(){
        return ResponseEntity.ok(syncService.pullSignalements());
    }

    @PostMapping("/sync-users")
    public ResponseEntity<?> syncUsers(){
        return ResponseEntity.ok(java.util.Map.of("ok", syncService.syncMobileUsers()));
    }

    @PostMapping("/resolve")
    public ResponseEntity<?> resolve(){
        return ResponseEntity.ok(java.util.Map.of("ok", syncService.resolveConflicts()));
    }
}
