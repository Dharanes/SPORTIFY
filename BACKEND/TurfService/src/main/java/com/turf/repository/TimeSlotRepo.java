package com.turf.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.turf.dto.TimeSlotIdDto;
import com.turf.model.Court;
import com.turf.model.TimeSlot;

import feign.Param;
import jakarta.transaction.Transactional;

public interface TimeSlotRepo extends JpaRepository<TimeSlot, Long> {

	@Query("SELECT t FROM TimeSlot t WHERE t.court.courtId = :courtId ORDER BY t.openingSlot ASC")
	List<TimeSlot> findByCourtIdSorted(@Param("courtId") Long courtId);

	@Query("SELECT t FROM TimeSlot t WHERE t.court.courtId = :courtId AND t.slotDate = :slotDate AND t.status = :status ORDER BY t.openingSlot ASC")
	List<TimeSlot> findByCourtIdAndStatusOrderByOpeningSlotAsc(@Param("courtId") Long courtId,
			@Param("status") String status, @Param("slotDate") LocalDate slotDate);

	@Query("SELECT t FROM TimeSlot t WHERE t.court.courtId = :courtId AND t.status = :status ORDER BY t.openingSlot ASC")
	List<TimeSlot> findByCourtAndStatusOrderByOpeningSlotAsc(@Param("court") Court court,
			@Param("status") String status);

	TimeSlot findByCourtAndTimeSlotId(Court court, Long timeSlotId);

	@Transactional
	@Modifying
	@Query("UPDATE TimeSlot t SET t.status = :status WHERE t.court.courtId = :courtId AND t.openingSlot = :openingSlot AND t.slotDate = :date")
	int updateTimeSlotStatus(@Param("courtId") Long courtId, @Param("openingSlot") LocalTime openingSlot,
			@Param("status") String status, LocalDate date);

	@Transactional
	@Modifying
	@Query("UPDATE TimeSlot t SET t.status = :status WHERE t.court.courtId = :courtId AND t.openingSlot = :time")
	int freeASlot(@Param("courtId") Long courtId, @Param("time") LocalTime time, @Param("status") String status);

	@Transactional
	@Query("DELETE FROM TimeSlot ts WHERE ts.court.courtId = :courtId")
	void deleteByCourtId(Long courtId);

//	@Query("SELECT DISTINCT new com.turf.dto.TimeSlotIdDto( " +
//		       "(SELECT MIN(ts.timeSlotId) FROM TimeSlot ts2 WHERE ts2.openingSlot = ts.openingSlot), " +
//		       "ts.openingSlot) " +
//		       "FROM TimeSlot ts " +
//		       "JOIN ts.court c " +
//		       "JOIN c.game g " +
//		       "JOIN g.turf t " +
//		       )
	@Query("SELECT DISTINCT ts.openingSlot FROM TimeSlot ts " + "JOIN ts.court c " + "JOIN c.game g " + "JOIN g.turf t "+
			"WHERE ts.status = 'free' " +
		       "AND t.turfId = :turfId " +
		       "AND g.gameID = :gameId " +
		       "AND ts.slotDate = :selectedDate " +
		       "GROUP BY ts.openingSlot")
		List<LocalTime> findFreeTimeSlotsForGame(Long turfId, Long gameId, LocalDate selectedDate);


	@Query(value = "SELECT c.court_name " + "FROM time_slot a "
			+ "JOIN time_slot b ON a.time_slot_id + 1 = b.time_slot_id " + "JOIN court c ON a.court_id = c.court_id "
			+ "JOIN game g ON c.game_id = g.gameid " + "JOIN turf t ON g.turf_id = t.turf_id "
			+ "WHERE a.opening_slot = :startTime " + "AND a.status = 'free' " + "AND t.turf_name = :turfName "
			+ "AND g.game = :gameName " + "AND a.slot_date = :selectedDate "
			+ "AND TIMESTAMPDIFF(HOUR, b.closing_slot, a.opening_slot) = :duration", nativeQuery = true)
	List<String> findCourtNamesByTimeSlot(@Param("startTime") String startTime, @Param("turfName") String turfName,
			@Param("gameName") String gameName, @Param("selectedDate") LocalDate selectedDate,
			@Param("duration") int duration);	

}
