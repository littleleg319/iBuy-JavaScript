package ibuy.ria.beans;

import java.sql.Blob;

import org.apache.tomcat.util.codec.binary.Base64;

public class Product {
	
	private String code;
	private String name;
	private String description;
	private String category;
	private String photo;
	private Float price;
	
	public String getCode() {
		return code;
	}

	public void setCode (String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName (String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription (String description) {
		this.description = description;
	}
	
	public String getCategory() {
		return category;
	}

	public void setCategory (String category) {
		this.category = category;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto (String string) {
		this.photo = string;
	}
	
	public Float getPrice() {
		return price;
	}

	public void setPrice (Float price) {
		this.price = price;
	}
	
}
