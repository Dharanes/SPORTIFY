package com.turf.repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.turf.dto.GamesIdDto;
import com.turf.dto.TurfDto;
import com.turf.model.Game;
import com.turf.model.Turf;

import feign.Param;
import jakarta.transaction.Transactional;

public interface GameRepo extends JpaRepository<Game, Long>  {

	@Query("SELECT g FROM Game g WHERE g.game = :name AND g.turf = :turf")
    Game findByNameAndTurf(@Param("name") String name, @Param("turf") Turf turf);
	
	@Query("SELECT g FROM Game g WHERE g.gameID = :gameID AND g.turf.turfId = :turfId")
    Game findByIdAndTurfId(@Param("turfId") Long turfId, @Param("name") Long gameID);
	
	@Transactional
	@Modifying
	@Query("UPDATE Game g SET g.startTime = :startTime WHERE g.gameID = :gameID")
	int updateStartTime(@Param("gameID") Long gameID, @Param("startTime") LocalTime startTime);

	@Transactional
	@Modifying
	@Query("UPDATE Game g SET g.endTime = :endTime WHERE g.gameID = :gameID")
	int updateEndTime(@Param("gameID") Long gameID, @Param("endTime") LocalTime endTime);

	List<Game> findByTurf_TurfId(Long id);
	
	@Transactional
    @Query("DELETE FROM Game g WHERE g.turf.turfName = :turfName AND g.game = :gameName")
    void deleteByTurfNameAndGameName(String turfName, String gameName);
	
	@Transactional
    @Query("SELECT g FROM Game g WHERE g.turf.turfName = :turfName AND g.game = :gameName")
    Optional<Game> findByTurfNameAndGameName(String turfName, String gameName);

	@Query("SELECT g.game FROM Game g where g.turf.turfName = :turfName")
	List<String> findByTurfName(String turfName);

	@Query("SELECT new com.turf.dto.GamesIdDto(g.gameID, g.game) FROM Game g WHERE g.turf.id = :turfId")
    List<GamesIdDto> findGamesByTurfId(@Param("turfId") Long turfId);
}
