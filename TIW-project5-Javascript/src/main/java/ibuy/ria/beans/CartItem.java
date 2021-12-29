package ibuy.ria.beans;

public class CartItem {
		private String prod_code;
		private Float price;
		private int qta;
		private int supid;
		private String prod_name;
		
		
		
		public String getProd_code() {
			return prod_code;
		}

		public void setProd_code(String prod_code) {
			this.prod_code = prod_code;
		}
		
		public int getSupid() {
			return supid;
		}

		public void setSupid(int supid) {
			this.supid = supid;
		}
		public Float getPrice() {
			return price;
		}

		public void setPrice(Float price) {
			this.price = price;
		}
		
		public int getQta() {
			return qta;
		}

		public void setQta(int qta) {
			this.qta = qta;
		}
		
		public String getProd_name() {
			return prod_name;
		}
		
		public void setProd_name(String prod_name) {
			this.prod_name=prod_name;
		}
		
}
