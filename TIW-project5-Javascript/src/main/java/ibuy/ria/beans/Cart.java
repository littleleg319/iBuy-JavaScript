package ibuy.ria.beans;

public class Cart {
	private int supid;
	private String supname;
	private float ship;
	private float Cost;
	private int totalQta;
	private float freeship;
	
	public int getSupid() {
		return supid;
	}

	public void setSupid(int supid) {
		this.supid = supid;
	}
	
	public float getShip() {
		return ship;
	}

	public void setShip(float ship) {
		this.ship = ship;
	}
	
	public float getCost() {
		return Cost;
	}

	public void setCost(float Cost) {
		this.Cost = Cost;
	}
	
	public String getSupname() {
		return supname;
	}
	
	public void setSupname(String supname) {
		this.supname=supname;
	}
	
	public int getTotalQta() {
		return totalQta;
	}

	public void setTotalQta(int totalQta) {
		this.totalQta = totalQta;
	}
	
	public void setFreeShip(float freeship) {
		this.freeship = freeship;
	}
	
	public float getFreeShip() {
		return freeship;
	}
}
