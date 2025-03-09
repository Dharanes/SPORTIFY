package com.turf.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.turf.model.Court;
import com.turf.model.Game;

import feign.Param;
import jakarta.transaction.Transactional;

public interface CourtRepo extends JpaRepository<Court, Long> {

	Court findByCourtNameAndGame(String courtName, Game game);

	@Query("SELECT c FROM Court c WHERE c.courtName = :courtName AND c.game.gameID = :gameID")
	Court findByCourtNameAndGameID(@Param("courtName") String courtName, @Param("gameID") Long gameID);

	@Transactional
	@Query("DELETE FROM Court c WHERE c.game.gameID = :gameId")
	void deleteByGameId(Long gameId);

	@Query("SELECT c.price FROM Court c where c.courtId = :courtId")
	double findPriceByCourtId(Long courtId);

}
