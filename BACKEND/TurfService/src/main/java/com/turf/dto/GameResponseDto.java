package com.turf.dto;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResponseDto {

	String name;
	LocalTime startTime;
	LocalTime endTime;
	Double price;
	Map<String,String> availableSlot;
	
}
