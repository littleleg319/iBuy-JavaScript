package ibuy.ria.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import ibuy.ria.beans.Product;

public class ProductDAO {
	private Connection con;
	
	public ProductDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<Product> findLastProductByUser(int userid) throws SQLException {
		List<Product> prods = new ArrayList<Product>();
		String usr = String.valueOf(userid);
		int s = 0;
		String check = "SELECT count(*) as total FROM user_product  WHERE userid = ?";
		try (PreparedStatement ps = con.prepareStatement(check);){
			ps.setString(1, usr);
			ResultSet res = ps.executeQuery();
			//l'utente ha visualizzato prodotti
			if (!res.isBeforeFirst()){
				s = 0;
			} else {
					res.next();
					s = res.getInt("total");
				if (s == 5) { //ho tutti e 5 i prodotti
						String query1 = "SELECT * FROM product INNER JOIN user_product ON product.code = user_product.productid  WHERE user_product.userid = ? ORDER BY timestamp DESC LIMIT 5";
						try (PreparedStatement pstatement = con.prepareStatement(query1);) {
								pstatement.setString(1, usr);
									try (ResultSet result = pstatement.executeQuery();) {
										while(result.next()) {
											Product prod = new Product();
											prod.setCode(result.getString("code"));
											prod.setName(result.getString("name"));
											prod.setDescription(result.getString("description"));
											prod.setCategory(result.getString("category"));
											prods.add(prod);
					}
				}
			}
		} else {
			int missing = 5 - s;
			if (s > 0) { //ho visto almeno un prodotto
			String seen_prod = "SELECT * FROM product INNER JOIN user_product ON product.code = user_product.productid  WHERE user_product.userid = ? ORDER BY timestamp DESC LIMIT 5";
			try (PreparedStatement pstatement = con.prepareStatement(seen_prod);) {
					pstatement.setString(1, usr);
						try (ResultSet result = pstatement.executeQuery();) {
							while(result.next()) {
								Product prod = new Product();
								prod.setCode(result.getString("code"));
								prod.setName(result.getString("name"));
								prod.setDescription(result.getString("description"));
								prod.setCategory(result.getString("category"));
								prods.add(prod);
							}
		}
	}
} 
	String default_cat = "SELECT * FROM product as p WHERE p.category = ? AND p.description like ? AND NOT EXISTS (SELECT code FROM product as m INNER JOIN user_product as u ON m.code = u.productid  WHERE u.userid = ? AND m.code = p.code)ORDER BY rand() limit 0,?"; 
	String category = "Gym Equipment";
		String discount = "discount";
		try (PreparedStatement pstatement = con.prepareStatement(default_cat);) {
			pstatement.setString(1, category);
			//prodotti in offerta hanno la stringa "discount"
			pstatement.setString(2,"%" + discount + "%");
			pstatement.setString(3, usr);
			pstatement.setInt(4, missing);
				try (ResultSet result = pstatement.executeQuery();) {
					while(result.next()) {
						Product prod = new Product();
						prod.setCode(result.getString("code"));
						prod.setName(result.getString("name"));
						prod.setDescription(result.getString("description"));
						prod.setCategory(result.getString("category"));
						prods.add(prod);
}
		
} 
				}
		} 
				}
		}
				return prods;
	}
	
	public List<String> findCategories () throws SQLException {
		List<String> categories = new ArrayList<String>();
		String query = "SELECT DISTINCT category FROM product";
		try (PreparedStatement pstatement = con.prepareStatement(query);) {
			try (ResultSet result = pstatement.executeQuery();) {
				if (!result.isBeforeFirst()) // no results. Something wrong
					return null;
				else {
					while (result.next()) {
						String cat = null;
						cat = result.getString("category");
						categories.add(cat);
					}
				}
			}
		}
		return categories;
	}
	
	
	public List<Product> findProductsByKey(String key) throws SQLException{
		List<Product> prods = new ArrayList<Product>();
		String escape_char = "%";
		String check = "SELECT * FROM product as p , supplier_product_price as s WHERE p.code=s.idproduct AND (p.name like ? or p.description like ?) AND s.price=(SELECT min(price) from supplier_product_price WHERE supplier_product_price.idproduct = p.code) ORDER BY s.price ASC";
		try (PreparedStatement ps = con.prepareStatement(check);) {
			ps.setString(1,"%" + key + "%");
			ps.setString(2,"%" + key + "%");
			ResultSet res = ps.executeQuery();
			if (!res.isBeforeFirst())
				return null;
			else {
				while(res.next()) {
					Product prod = new Product();
					prod.setCode(res.getString("code"));
					prod.setName(res.getString("name"));
					prod.setPrice(res.getFloat("price"));
					prods.add(prod);
				}
			}
		}
		return prods;
	}
	
	public List<Product> findProductsByCategory (String category, String keyword) throws SQLException {
		List<Product> prods = new ArrayList<Product>();	
		if (keyword == null || keyword=="") {
			//non ho messo keyword, ma solo category
		String query = "SELECT * FROM product as p , supplier_product_price as s WHERE p.code=s.idproduct AND p.category = ? AND s.price=(SELECT min(price) from supplier_product_price WHERE supplier_product_price.idproduct = p.code) ORDER BY s.price ASC";
		try (PreparedStatement pstatement = con.prepareStatement(query);) {
				pstatement.setString(1, category);
			try (ResultSet result = pstatement.executeQuery();) {
				if (!result.isBeforeFirst()) // no results. Something wrong
					return null;
				else {
					while (result.next()) {
						Product prod = new Product();
						prod.setCode(result.getString("code"));
						prod.setName(result.getString("name"));
						prod.setDescription(result.getString("description"));
						prod.setCategory(result.getString("category"));
						prod.setPrice(result.getFloat("price"));
						prods.add(prod);
					}
				}
			}
		}
		return prods;
		} else  {
			//filtro sia per category che per keyword
			String query = "SELECT * FROM product as p , supplier_product_price as s WHERE p.code=s.idproduct AND (p.name like ? or p.description like ?) AND p.category = ? AND s.price=(SELECT min(price) from supplier_product_price WHERE supplier_product_price.idproduct = p.code) ORDER BY s.price ASC";
			try (PreparedStatement pstatement = con.prepareStatement(query);) {
				pstatement.setString(1,"%" + keyword + "%");
				pstatement.setString(2,"%" + keyword + "%");
				pstatement.setString(3, category);
				try (ResultSet result = pstatement.executeQuery();) {
					if (!result.isBeforeFirst()) // no results. Something wrong
						return null;
					else {
						while (result.next()) {
							Product prod = new Product();
							prod.setCode(result.getString("code"));
							prod.setName(result.getString("name"));
							prod.setDescription(result.getString("description"));
							prod.setCategory(result.getString("category"));
							prod.setPrice(result.getFloat("price"));
							prods.add(prod);
						}
					}
				}
			}
			return prods;
		}
	}
}
