package com.turf.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedTurfDto {
	private Long id;
	private String name;
    private String location;
    private String owner;
    private LocalDate registeredOn;
    private double rating;
    private Long ratingCount;
	List<String> availableGames;
}
