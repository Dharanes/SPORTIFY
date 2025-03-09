package com.turf.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.turf.dto.TurfDto;
import com.turf.model.Turf;


public interface TurfRepo extends JpaRepository<Turf, Long> {

	@Query("SELECT t, t.availableGames FROM Turf t LEFT JOIN t.availableGames games GROUP BY t.turfId")
	List<Object[]> findAvailableGamesByTurf();

	@Query("SELECT t, t.availableGames FROM Turf t LEFT JOIN t.availableGames g WHERE t.turfId = :turfId GROUP BY t.turfId")
	List<Object[]> countGamesByTurfId(Long turfId);

	@Query("SELECT new com.turf.dto.TurfDto(t.turfId,t.turfName, t.location, t.imageUrl) FROM Turf t WHERE t.ownerId = :id")
	List<TurfDto> findTurfByOwnerId(Long id);

	@Query("SELECT new com.turf.dto.TurfDto(t.turfId,t.turfName, t.location, t.imageUrl) FROM Turf t WHERE t.turfName LIKE CONCAT('%', :name, '%')")
	List<TurfDto> findTurfByNameContaining(@Param("name") String name);

	@Query("SELECT new com.turf.dto.TurfDto(t.turfId,t.turfName, t.location, t.imageUrl) FROM Turf t WHERE t.location LIKE CONCAT('%', :loc, '%')")
	List<TurfDto> findTurfByLocationContaining(@Param("loc") String loc);

	Turf findByTurfName(String turfName);

	@Query("SELECT t FROM Turf t WHERE t.ownerId = :ownerId")
	List<Turf> findByOwnerId(@Param("ownerId") String ownerId);

	@Query("SELECT new com.turf.dto.TurfDto(t.turfId,t.turfName, t.location, t.imageUrl) "
			+ "FROM Turf t JOIN t.availableGames g WHERE t.location LIKE %:location% AND g.game = :gameName")
	List<TurfDto> findByLocationAndGameName(@Param("location") String location, @Param("gameName") String gameName);

}
