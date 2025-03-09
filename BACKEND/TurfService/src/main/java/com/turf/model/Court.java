package com.turf.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Court {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long courtId;
	String courtName;
	String description;
	Double price;

	@ManyToOne
	@JoinColumn(name = "game_id")
	@JsonBackReference
	Game game;
	
	@OneToMany(mappedBy = "court",cascade = CascadeType.ALL,orphanRemoval = true)
	@JsonManagedReference
	List<TimeSlot> timeSlot;
	

}
