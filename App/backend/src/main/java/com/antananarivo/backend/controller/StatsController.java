package com.antananarivo.backend.controller;

import com.antananarivo.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final StatsService statsService;
    public StatsController(StatsService statsService){this.statsService = statsService;}

    @GetMapping("/public")
    public ResponseEntity<Map<String,Object>> publicStats(){
        return ResponseEntity.ok(Map.of(
                "totalReports", statsService.totalReports(),
                "totalSurface", statsService.totalSurface(),
                "totalBudget", statsService.totalBudget(),
                "overallProgressPercent", statsService.overallProgressPercent()
        ));
    }

    @GetMapping("/manager")
    public ResponseEntity<Map<String,Object>> managerStats(){
        return ResponseEntity.ok(Map.of(
                "averageResolutionSeconds", statsService.averageResolutionSeconds(),
                "overallProgressPercent", statsService.overallProgressPercent()
        ));
    }
}
