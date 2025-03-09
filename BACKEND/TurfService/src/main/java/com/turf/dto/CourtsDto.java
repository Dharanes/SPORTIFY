package com.turf.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourtsDto {

	String name;
	String description;
	Double price;
	Integer noOfCourts;
	LocalTime startTime;
	LocalTime endTime;
	
}
