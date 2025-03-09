package com.turf.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurfGamesDto {

	String turfName;
	String turfLocation;
	List<GamesDto> availableGames;
	Integer numberOfAvailableGames;
}
