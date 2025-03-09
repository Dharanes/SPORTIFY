package com.turf.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turf.model.Ratings;

public interface RatingRepo extends JpaRepository<Ratings, Long> {


	Optional<Ratings> findByTurf_TurfId(Long turfId); 
	
}
