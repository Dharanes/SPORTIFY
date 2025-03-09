package com.turf.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.turf.dto.ApprovedTurfDto;
import com.turf.dto.BookingDto;
import com.turf.dto.CourtDto;
import com.turf.dto.CourtIdDto;
import com.turf.dto.CourtsDto;
import com.turf.dto.GamesDto;
import com.turf.dto.GamesIdDto;
import com.turf.dto.TimeSlotDto;
import com.turf.dto.TurfDto;
import com.turf.dto.TurfGameCourtDto;
import com.turf.dto.TurfGamesDto;
import com.turf.dto.PendingTurfDto;
import com.turf.dto.RatingDto;
import com.turf.exception.CannotAccessOtherTurf;
import com.turf.exception.GameAlreadyExistsException;
import com.turf.exception.TurfNameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.feign.BookingClient;
import com.turf.feign.OwnerClient;
import com.turf.model.Booking;
import com.turf.model.Court;
import com.turf.model.Game;
import com.turf.model.Ratings;
import com.turf.model.TimeSlot;
import com.turf.model.Turf;
import com.turf.model.TurfApproval;
import com.turf.repository.CourtRepo;
import com.turf.repository.GameRepo;
import com.turf.repository.RatingRepo;
import com.turf.repository.TimeSlotRepo;
import com.turf.repository.TurfApprovalRepo;
import com.turf.repository.TurfRepo;

import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TurfServiceImpl implements TurfService {

	private final GameRepo gameRepo;
	private final TurfRepo turfRepo;
	private final CourtRepo courtRepo;
	private final TimeSlotRepo timeSlotRepo;
	private final TurfApprovalRepo approvalRepo;
	private final RatingRepo ratingRepo;
	private final BookingClient bookingClient;
	private final OwnerClient ownerClient;
	private static final String GAME_NOT_FOUND = "No Game Found with Name: ";

	@Override
	public Long addTurf(String authHeader, Turf turf) throws TurfNameAlreadyExistsException {

		String id = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			Claims claim = JwtService.extractClaims(token);
			id = claim.getSubject();
		}

		Turf trf = turfRepo.findByTurfName(turf.getTurfName());
		if (trf != null) {
			throw new TurfNameAlreadyExistsException("Turf Name Already Exists");
		}

		turf.setRegisteredOn(LocalDate.now());
		turf.setOwnerId(id);
		turfRepo.save(turf);
		TurfApproval approval = new TurfApproval();
		Ratings ratings = new Ratings();
		ratings.setTurf(turf);
		ratings.setRating(0.0);
		ratings.setNumberOfRatings(0l);
		approval.setTurf(turf);
		approvalRepo.save(approval);
		ratingRepo.save(ratings);
		return turfRepo.findByTurfName(turf.getTurfName()).getTurfId();
	}

	@Override
	public Game registerGameToTurf(String authHeader, Long id, Game games)
			throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf {
		String ownerId = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			Claims claim = JwtService.extractClaims(token);
			ownerId = claim.getSubject();
		}
		List<Turf> turfs = turfRepo.findByOwnerId(ownerId);
		Turf tr = turfs.stream().filter(turf -> turf.getTurfId() == id).findFirst().get();

		if (tr != null) {
			Optional<Turf> turf = turfRepo.findById(id);

			if (turf.isEmpty()) {
				throw new TurfNotFoundException("No Turf with ID: " + id);
			}

			Turf trf = turf.get();
			games.setTurf(trf);
			return gameRepo.save(games);
		}
		throw new CannotAccessOtherTurf("Owner should add details of his turf");

	}

	@Transactional
	private List<TimeSlot> saveTimeSlot(LocalTime startTime, LocalTime endTime, Court court) {

		List<TimeSlot> slots = new ArrayList<>();
		if (court.getCourtId() == null) {
			courtRepo.save(court);
		}
		LocalDate today = LocalDate.now();
		IntStream.range(0, 7).forEach(i -> {
			LocalDate date = today.plusDays(i);
			LocalTime curTime = startTime;
			while (!curTime.isAfter(endTime.minusHours(1))) {
				TimeSlot slot = new TimeSlot();
				String openingTime = curTime.toString();
				String closingTime = curTime.plusHours(1).toString();
				slot.setOpeningSlot(LocalTime.parse(openingTime));
				slot.setClosingSlot(LocalTime.parse(closingTime));
				slot.setSlotDate(date);
				slot.setStatus("Free");
				slot.setCourt(court);
				timeSlotRepo.save(slot);
				curTime = curTime.plusHours(1);
				slots.add(slot);
			}
		});

		return slots;

	}

	@Override
	public List<CourtDto> addCourtToGame(Long id, String gameName, Court court) {
		Optional<Turf> foundTurf = turfRepo.findById(id);
		List<CourtDto> courtSlots = new ArrayList<>();
		if (foundTurf.isPresent()) {
			Turf turf = foundTurf.get();
			Game game = turf.getAvailableGames().stream().filter(g -> g.getGame().equals(gameName)).findFirst()
					.orElseThrow(() -> new EntityNotFoundException(GAME_NOT_FOUND + gameName));
			LocalTime startTime = game.getStartTime();
			LocalTime endTime = game.getEndTime();
			court.setGame(game);
			saveTimeSlot(startTime, endTime, court);
			courtSlots.add(new CourtDto(court.getCourtId(),court.getCourtName(), court.getDescription(), court.getPrice()));
		}
		return courtSlots;

	}

	@Override
	public TurfGamesDto getTurfGamesByTurfId(Long id) {
		Turf turf = turfRepo.findById(id).orElseThrow(() -> new RuntimeException("Turf not found"));

		// Get the list of games for the turf
		List<Game> games = gameRepo.findByTurf_TurfId(id);

		// Convert the list of games to GameDTO
		List<GamesDto> gameDTOs = games.stream()
				.map(game -> new GamesDto(game.getGame(), game.getStartTime(), game.getEndTime())).toList();

		return new TurfGamesDto(turf.getTurfName(), turf.getLocation(), gameDTOs, gameDTOs.size());
	}

	@Override
	public List<TurfGamesDto> getTurfGames() {
		List<Turf> turfs = turfRepo.findAll();

		return turfs.stream().map(turf -> {
			List<Game> games = gameRepo.findByTurf_TurfId(turf.getTurfId());

			List<GamesDto> gamesDto = games.stream()
					.map(game -> new GamesDto(game.getGame(), game.getStartTime(), game.getEndTime())).toList();
			return new TurfGamesDto(turf.getTurfName(), turf.getLocation(), gamesDto, gamesDto.size());
		}).toList();
	}

	@Override
	public List<TurfDto> getAllTurfsByOwnerId(Long id) {
		return turfRepo.findTurfByOwnerId(id);
	}

	@Override
	public List<TurfDto> filterTurfByName(String name) throws TurfNotFoundException {
		List<TurfDto> turfList = turfRepo.findTurfByNameContaining(name);
		if (turfList.isEmpty())
			throw new TurfNotFoundException("No Turf Exist for Provided Name");
		else
			return turfList;
	}

	@Override
	public List<TurfDto> filterTurfByLocation(String loc) throws TurfNotFoundException {

		List<TurfDto> turfList = turfRepo.findTurfByLocationContaining(loc);
		if (turfList.isEmpty())
			throw new TurfNotFoundException("No Turf Exist for Provided Location");
		else
			return turfList;
	}

	@Override
	public void updateTurfGameStartTiming(String turfName, String gameName, LocalTime updatedStartTime) {
		Turf turf = turfRepo.findByTurfName(turfName);

		Game game = turf.getAvailableGames().stream().filter(g -> g.getGame().equals(gameName)).findFirst()
				.orElseThrow(() -> new EntityNotFoundException(GAME_NOT_FOUND + gameName));

		Long gameID = game.getGameID();
		gameRepo.updateStartTime(gameID, updatedStartTime);

		List<Court> courts = game.getCourts().stream().filter(court -> court.getGame().getGameID().equals(gameID))
				.toList();
		LocalTime endTime = game.getEndTime();

		updateTimeSlot(courts, updatedStartTime, endTime);

	}

	@Override
	public void updateTurfGameEndTiming(String turfName, String gameName, LocalTime updatedEndTime) {
		Turf turf = turfRepo.findByTurfName(turfName);

		Game game = turf.getAvailableGames().stream().filter(g -> g.getGame().equals(gameName)).findFirst()
				.orElseThrow(() -> new EntityNotFoundException(GAME_NOT_FOUND + gameName));

		game.setEndTime(updatedEndTime);
		Long gameID = game.getGameID();

		gameRepo.updateEndTime(gameID, updatedEndTime);

		List<Court> courts = game.getCourts().stream().filter(court -> court.getGame().getGameID().equals(gameID))
				.toList();
		LocalTime startTime = game.getStartTime();

		updateTimeSlot(courts, startTime, updatedEndTime);

	}

	private void updateTimeSlot(List<Court> courts, LocalTime updatedStartTime, LocalTime updatedEndTime) {

		for (Court court : courts) {
			List<TimeSlot> newSlots = new ArrayList<>();
			Long id = court.getCourtId();
			List<TimeSlot> slots = timeSlotRepo.findByCourtIdSorted(id);
			int size = slots.size();

			if (size > 0 && updatedStartTime.isBefore(slots.get(0).getOpeningSlot())) {
				LocalTime curTime = updatedStartTime;
				LocalTime tillTime = slots.get(0).getOpeningSlot();

				while (curTime.isBefore(tillTime)) {
					TimeSlot slot = new TimeSlot();
					slot.setOpeningSlot(curTime);
					slot.setClosingSlot(curTime.plusHours(1));
					slot.setStatus("Free");
					slot.setCourt(court);
					newSlots.add(slot);
					curTime = curTime.plusHours(1);
				}
			}

			if (updatedEndTime.isAfter(slots.get(size - 1).getOpeningSlot())) {
				LocalTime curTime = slots.get(size - 1).getClosingSlot();
				while (curTime.isBefore(updatedEndTime)) {
					TimeSlot slot = new TimeSlot();
					slot.setOpeningSlot(curTime);
					slot.setClosingSlot(curTime.plusHours(1));
					slot.setStatus("Free");
					slot.setCourt(court);
					newSlots.add(slot);
					curTime = curTime.plusHours(1);
				}
			}
			if (!newSlots.isEmpty()) {
				timeSlotRepo.saveAll(newSlots);
			}
			List<TimeSlot> deletedSlots = slots.stream().filter(slot -> slot.getOpeningSlot().isBefore(updatedStartTime)
					|| updatedEndTime.isBefore(slot.getClosingSlot())).toList();
			if (!deletedSlots.isEmpty()) {
				timeSlotRepo.deleteAll(deletedSlots);
			}

		}

	}

	@Override
	public void updateGameCourtTypePrice(Long turfId, String gameName, String courtType, CourtDto courtDto) {
		Turf turf = turfRepo.findById(turfId).get();
		List<Court> courts = new ArrayList<>();

		List<Game> games = turf.getAvailableGames();
		for (Game game : games) {
			if (game.getGame().equals(gameName)) {
				courts = game.getCourts();
				break;
			}
		}
		
		for (Court court : courts) {
			if (court.getCourtName().equals(courtType)) {
				court.setCourtName(courtDto.getCourtType());
				court.setDescription(courtDto.getCourtStyle());
				court.setPrice(courtDto.getPrice());
				courtRepo.save(court);
			}
		}

	}

	@Override
	public List<TimeSlotDto> getAvailableSlot(Long turfId, String gameName, Long courtId, int duration,
			LocalDate date) {
		Turf turf = turfRepo.findById(turfId).get();
		// if turf is null then throw exception

		Game game = gameRepo.findByNameAndTurf(gameName, turf);
		// if game is null then throw exception

		Court court = courtRepo.findById(courtId).get();
		// if court is null then throw exception

		List<TimeSlot> availableTimeSlots = timeSlotRepo.findByCourtIdAndStatusOrderByOpeningSlotAsc(court.getCourtId(),
				"Free", date);

		List<TimeSlotDto> filteredTimeSlots = new ArrayList<>();

		for (int i = 0; i < availableTimeSlots.size(); i++) {
			TimeSlot timeSlot = availableTimeSlots.get(i);
			LocalTime combinedStartTime = timeSlot.getOpeningSlot();
			LocalTime combinedEndTime = timeSlot.getClosingSlot();
			long combinedDuration = Duration.between(combinedStartTime, combinedEndTime).toMinutes();

			if (combinedDuration == duration) {
				TimeSlotDto dto = new TimeSlotDto(timeSlot.getTimeSlotId(), timeSlot.getOpeningSlot(),
						timeSlot.getClosingSlot(), timeSlot.getCourt().getPrice(), court.getCourtId());
				filteredTimeSlots.add(dto);
				continue;
			}
			int count = 1;
			for (int j = i + 1; j < duration + i && j < availableTimeSlots.size(); j++) {
				TimeSlot nextSlot = availableTimeSlots.get(j);
				if (!nextSlot.getOpeningSlot().equals(combinedEndTime)) {
					break;
				}
				combinedEndTime = nextSlot.getClosingSlot();
				count++;

			}
			if (count == duration) {
				TimeSlotDto dto = new TimeSlotDto(timeSlot.getTimeSlotId(), combinedStartTime, combinedEndTime,
						timeSlot.getCourt().getPrice() * duration, court.getCourtId());
				filteredTimeSlots.add(dto);
			}
		}
		return filteredTimeSlots;
	}

	@Override
	public void bookATurf(Long turfId, String gameName, Long courtId, Long timeSlotId, int duration,
			LocalDate date) {
		Turf turf = turfRepo.findById(turfId).get();

		Game game = gameRepo.findByNameAndTurf(gameName, turf);

		Court court = courtRepo.findById(courtId).get();

		TimeSlot timeSlot = timeSlotRepo.findById(timeSlotId).get();
		LocalTime time = timeSlot.getOpeningSlot();

		int i = 0;
		while (i++ < duration) {
			timeSlotRepo.updateTimeSlotStatus(courtId, time, "Booked", date);
			time = time.plusHours(1);
		}
	}

	@Override
	public void freeACourt(Long turfId, String gameName, Long courtId, Long timeSlotId, Integer duration) {
		Turf turf = turfRepo.findById(turfId).get();

		Game game = gameRepo.findByNameAndTurf(gameName, turf);

		Court court = courtRepo.findById(courtId).get();

		TimeSlot slot = timeSlotRepo.findById(timeSlotId).get();
		LocalTime time = slot.getOpeningSlot();
		int i = 0;
		while (i++ < duration) {
			timeSlotRepo.freeASlot(court.getCourtId(), time, "Free");
			time = time.plusHours(1);
		}
	}

	@Override
	public String deleteTurf(String turfName) throws TurfNotFoundException {
		Turf trf = turfRepo.findByTurfName(turfName);
        if (trf != null) {
            turfRepo.delete(trf);
            return turfName;
        } else {
            return "Turf not found with name: " + turfName;
        }
	}

	@Override
	@Transactional
	public void deleteGame(Long turfId, String gameName) {

		Turf turf = turfRepo.findById(turfId).get();

		Game gameToRemove = turf.getAvailableGames().stream().filter(game -> game.getGame().equals(gameName))
				.findFirst().orElseThrow(() -> new RuntimeException("Game not found with name: " + gameName));

		turf.getAvailableGames().remove(gameToRemove);

		gameRepo.delete(gameToRemove);

		turfRepo.save(turf);
	}

	@Override
	@Transactional
	public void deleteCourtFromGame(Long courtId) {
//		Turf turf = turfRepo.findByTurfName(turfName);
//
//		Game game = turf.getAvailableGames().stream().filter(g -> g.getGame().equals(gameName)).findFirst()
//				.orElseThrow(() -> new RuntimeException("Game not found with name: " + gameName));
//
//		Court courtToRemove = game.getCourts().stream().filter(court -> court.getCourtId().equals(courtId)).findFirst()
//				.orElseThrow(() -> new RuntimeException("Court not fount with id: " + courtId));
//
//		game.getCourts().remove(courtToRemove);
//
//		courtRepo.delete(courtToRemove);
//
//		gameRepo.save(game);
//
//		turfRepo.save(turf);
		courtRepo.deleteById(courtId);
	}

	@Override
	public Map<String, Map<String, List<BookingDto>>> getBookings(String authorizationHeader) {

		Map<String, Map<String, List<BookingDto>>> bookings = new HashMap<>();

		String id = null;

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);
			Claims claim = JwtService.extractClaims(token);
			id = claim.getSubject();
		}
		if (id != null) {
			List<Turf> turfsByOwnerId = turfRepo.findByOwnerId(id);

			turfsByOwnerId.forEach(turf -> {
				List<Booking> booking = bookingClient.getBookingByTurfName(turf.getTurfName());
				Map<String, List<BookingDto>> byGames = new HashMap<>();
				booking.forEach(book -> {
					BookingDto bookingDto = new BookingDto(book.getBookingId(), book.getUserId(), book.getCourtName(),
							book.getTimeSlotId(), book.getBookedOn(),book.getStatus(), book.getSlotDate(), book.getSlotTime(),
							book.getDuration(), book.getCost());
					if (byGames.containsKey(book.getGameName())) {
						byGames.get(book.getGameName()).add(bookingDto);
					} else {
						List<BookingDto> bookingList = new ArrayList<>();
						bookingList.add(bookingDto);
						byGames.put(book.getGameName(), bookingList);
					}
				});
				bookings.put(turf.getTurfName(), byGames);
			});

		}
		return bookings;
	}

	@Override
	public List<TurfDto> getAllTurfs() {
		List<Turf> turfs = turfRepo.findAll();
		return turfs.stream().map(turf -> new TurfDto(turf.getTurfId(),turf.getTurfName(), turf.getLocation(), turf.getImageUrl()))
				.toList();
	}

	@Override
	public String getTurfName(Long turfId) {
		Turf turf = turfRepo.findById(turfId).get();
		return turf.getTurfName();
	}

	@Override
	public List<GamesIdDto> getGames(Long turfId) {
		return gameRepo.findGamesByTurfId(turfId);
	}

	@Override
	public List<LocalTime> getTimeSlot(Long turfId, Long gameId, LocalDate selectedDate) {
		return timeSlotRepo.findFreeTimeSlotsForGame(turfId, gameId, selectedDate);
	}

	@Override
	public List<CourtIdDto> getCourtName(Long gameId, LocalDate selectedDate, String selectedTime,
			int duration) {
		List<CourtIdDto> freeCourts = new ArrayList<>();
		Map<String,Integer> freq = new HashMap<>();
		
		Game game = gameRepo.findById(gameId).get();

		List<Court> courts = game.getCourts();
		

		for (Court court : courts) {
			List<TimeSlot> slots = court.getTimeSlot();
			slots = slots.stream().filter(slot -> slot.getSlotDate().equals(selectedDate))
					.sorted(Comparator.comparing(TimeSlot::getOpeningSlot)).toList();
			boolean isTrue = true;
			for (int i = 0; i < slots.size(); i++) {
				if (slots.get(i).getOpeningSlot().toString().equals(selectedTime)
						&& slots.get(i).getStatus().equals("Free")) {
					for (int j = 1; j < duration; j++) {
						TimeSlot slo = slots.get(i + j);
						if (!slo.getStatus().equals("Free")) {
							isTrue = false;
							break;
						}
					}
					if (isTrue) {
						freq.put(court.getCourtName(), freq.getOrDefault(court.getCourtName(), 0)+1);
						freeCourts.add(new CourtIdDto(court.getCourtId(),court.getCourtName()+" "+freq.get(court.getCourtName())));
						break;
					}
				}
			}
		}
		return freeCourts;
	}

	@Override
	public List<TurfDto> getTurfs(String authHeader) {
		String id = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			Claims claim = JwtService.extractClaims(token);
			id = claim.getSubject();
		}
		List<Turf> turfs = turfRepo.findByOwnerId(id);
		return turfs.stream()
				.filter(turf -> approvalRepo.findByTurfId(turf.getTurfId()).getStatus().equalsIgnoreCase("approved"))
				.map(turf -> new TurfDto(turf.getTurfId(),turf.getTurfName(),turf.getLocation(),turf.getImageUrl()))
				.toList();
	}
	@Override
	public List<TurfDto> getPendingTurfs(String authHeader) {
		String id = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			Claims claim = JwtService.extractClaims(token);
			id = claim.getSubject();
		}
		List<Turf> turfs = turfRepo.findByOwnerId(id);
		return turfs.stream()
				.filter(turf -> approvalRepo.findByTurfId(turf.getTurfId()).getStatus().equalsIgnoreCase("pending"))
				.map(turf -> new TurfDto(turf.getTurfId(),turf.getTurfName(),turf.getLocation(),turf.getImageUrl()))
				.toList();
	}

	@Override
	public List<Map<String, Object>> filterByLocationAndGame(String location, String gameName) {
		List<TurfDto> res = turfRepo.findByLocationAndGameName(location,gameName);

		return res.stream().filter(obj -> {
			TurfApproval approval = approvalRepo.findByTurfId(obj.getTurfId());

			return approval != null && "approved".equalsIgnoreCase(approval.getStatus());
		}).map(obj -> {
			TurfGamesDto games = getTurfGamesByTurfId(obj.getTurfId());
			RatingDto rating = getRating(obj.getTurfId());
			Map<String, Object> turfDetails = new HashMap<>();
			turfDetails.put("turfId", obj.getTurfId());
			turfDetails.put("turfName", obj.getTurfName());
			turfDetails.put("turfLocation", obj.getTurfLocation());
			turfDetails.put("imageUrl", obj.getImageUrl());
			turfDetails.put("games", games.getAvailableGames().stream().map(GamesDto::getName));
			turfDetails.put("rating", rating.getRating());
			turfDetails.put("noOfRating", rating.getNumberOfRatings());
			return turfDetails;
		}).toList();
	}

	@Override
	public List<TurfGameCourtDto> getTurfByTurfName(Long turfId) {
		Turf trf = turfRepo.findById(turfId).get();
		return trf.getAvailableGames().stream()
	    .map(game -> new TurfGameCourtDto(
	    	game.getGameID(),
	        game.getGame(),
	        game.getStartTime(),
	        game.getEndTime(),
	        game.getCourts().stream()
	            .map(court -> new CourtDto(court.getCourtId(),court.getCourtName(), court.getDescription(), court.getPrice()))
	            .toList()
	    ))
	    .toList();
	}

	@Override
	public double getPrice(Long courtId) {
		return courtRepo.findPriceByCourtId(courtId);
	}

	@Override
	public String getTurfImage(String turfName) {
		Turf trf = turfRepo.findByTurfName(turfName);
		return trf.getImageUrl();
	}

	@Override
	public Long numberOfTurf() {
		return (long) turfRepo.findAll().stream()
				.filter(turf -> approvalRepo.findByTurfId(turf.getTurfId()).getStatus().equalsIgnoreCase("approved"))
				.toList().size();
	}

	@Override
	public List<PendingTurfDto> getPendingRequests() {
		String status = "PENDING";
		return turfRepo.findAll().stream()
				.filter(turf -> approvalRepo.findByTurfId(turf.getTurfId()).getStatus().equalsIgnoreCase(status))
				.map(turf -> new PendingTurfDto(turf.getTurfId(), turf.getTurfName(), turf.getLocation(), status))
				.toList();
	}

	@Override
	public List<ApprovedTurfDto> getApprovedRequests() {
		String status = "APPROVED";
		return turfRepo.findAll().stream()
				.filter(turf -> approvalRepo.findByTurfId(turf.getTurfId()).getStatus().equalsIgnoreCase(status))
				.map(turf -> {
					RatingDto rating = getRating(turf.getTurfId());
					return new ApprovedTurfDto(turf.getTurfId(), turf.getTurfName(), turf.getLocation(),
							ownerClient.getById(Long.valueOf(turf.getOwnerId())).getUserName(), turf.getRegisteredOn(),
							rating.getRating(), rating.getNumberOfRatings(),
							turf.getAvailableGames().stream().map(Game::getGame).toList());
				}).toList();
	}

	@Override
	public String updateStatus(Long id, String status) {
		TurfApproval trf =  approvalRepo.findByTurfId(id);
		trf.setStatus(status);
		approvalRepo.save(trf);
		return "Updated";
	}

	@Override
	public TurfDto getTurf(Long turfId) {
		Turf trf = turfRepo.findById(turfId).get();
		return new TurfDto(trf.getTurfId(),trf.getTurfName(),trf.getLocation(),trf.getImageUrl());
	}

	@Override
	public String courtName(Long courtId) {
		return courtRepo.findById(courtId).get().getCourtName();
	}

	@Override
	public ResponseEntity<String> submitRating(Long turfId, Double rating) {
		Ratings rtng = ratingRepo.findByTurf_TurfId(turfId).get();
		Long noOfRating = rtng.getNumberOfRatings();
		double currentRating = (rtng.getRating()*noOfRating + rating)/(noOfRating+1);
		rtng.setNumberOfRatings(noOfRating+1);
		rtng.setRating(currentRating);
		ratingRepo.save(rtng);
		return ResponseEntity.status(200).body("updated");
	}

	@Override
	public RatingDto getRating(Long turfId) {
		Ratings rtng = ratingRepo.findByTurf_TurfId(turfId).get();
		return new RatingDto(rtng.getRating(),rtng.getNumberOfRatings());
	}
	
	@Override
	public List<CourtsDto> courtDetails(Long turfId, Long gameId) {
	    Game game = gameRepo.findByIdAndTurfId(turfId, gameId);
	    List<Court> courts = game.getCourts();

	    Map<String, Object> freq = courts.stream()
	        .collect(Collectors.toMap(
	            Court::getCourtName,
	            court -> {
	                Map<String, Object> details = new HashMap<>();
	                details.put("numberOfCourts", 1); // Initial count
	                details.put("description", court.getDescription());
	                details.put("price", court.getPrice());
	                details.put("startTime", game.getStartTime());
	                details.put("endTime", game.getEndTime());
	                return details;
	            },
	            (details1, details2) -> {
	                Map<String, Object> mergedDetails = new HashMap<>((Map<String, Object>) details1);
	                mergedDetails.put("numberOfCourts",
	                    (Integer) mergedDetails.get("numberOfCourts") + (Integer) ((Map<String, Object>) details2).get("numberOfCourts"));
	                return mergedDetails;
	            }
	        ));

	    return freq.entrySet().stream()
	        .map(entry -> {
	            String courtName = entry.getKey();
	            Map<String, Object> details = (Map<String, Object>) entry.getValue();
	            return new CourtsDto(
	                courtName,
	                (String) details.get("description"),
	                (Double) details.get("price"),
	                (Integer) details.get("numberOfCourts"),
	                (LocalTime) details.get("startTime"),
	                (LocalTime) details.get("endTime")
	            );
	        })
	        .toList();
	}
}
