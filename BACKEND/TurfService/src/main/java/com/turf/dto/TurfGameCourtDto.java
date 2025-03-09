package com.turf.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurfGameCourtDto {
	
	Long gameID;
	String gameName;
	LocalTime startTime;
	LocalTime endTime;
	List<CourtDto> courts;
}
