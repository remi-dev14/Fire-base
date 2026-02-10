package com.antananarivo.backend.repository;

import com.antananarivo.backend.model.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
	java.util.List<com.antananarivo.backend.model.StatusHistory> findByReportIdOrderByWhenSetDesc(Long reportId);

	java.util.List<com.antananarivo.backend.model.StatusHistory> findByReportIdOrderByWhenSetAsc(Long reportId);

}
