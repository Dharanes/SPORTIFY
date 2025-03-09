package com.turf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.turf.model.TurfApproval;


public interface TurfApprovalRepo extends JpaRepository<TurfApproval, Long> {

	@Query("SELECT ta FROM TurfApproval ta WHERE ta.turf.id = :turfId")
    TurfApproval findByTurfId(@Param("turfId") Long turfId);
}
