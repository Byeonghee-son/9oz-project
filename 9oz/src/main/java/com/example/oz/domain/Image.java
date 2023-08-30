package com.example.oz.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="codeclass")
public class Image {
	@Id
	private Long id;
	private String product_code;
	private String product_name;
	private String color_name;
	private String size;
	private String sale_price;
	private String mainclass;
	private String semiclass;
	@Column(length=1000)
	private String image_path;
	
}
