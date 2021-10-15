package ibuy.ria.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.thymeleaf.context.WebContext;

import com.google.gson.Gson;

import ibuy.ria.beans.PriceRange;
import ibuy.ria.beans.Product;
import ibuy.ria.beans.Supplier;
import ibuy.ria.beans.User;
import ibuy.ria.dao.SupplierDAO;
import ibuy.ria.dao.ProductDAO;
import ibuy.ria.utilities.ConnectionHandler;

/**
 * Servlet implementation class ProductDetailData
 */
@WebServlet("/ProductDetailData")
public class ProductDetailData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProductDetailData() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//Dichiaro variabili e prendo la sessione utente
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		List<Supplier> suppliers = new ArrayList<Supplier>();
		List<Product> prods_list = new ArrayList<Product>();
		List<PriceRange> range = new ArrayList<PriceRange>();
		ProductDAO products = new ProductDAO(connection);
		SupplierDAO supp = new SupplierDAO(connection);
		String product = null;
		Product prod = new Product();
		try { //Cerco dettagli prodotto 
			product = StringEscapeUtils.escapeJava(request.getParameter("code"));
			prod = products.findProductDetails(product); 					
			suppliers = supp.findSupplierDetails(product);
			int[] supid = supp.findSupplierIds(product);
			range = supp.findShippingRanges(supid);
			if (prod == null || suppliers == null) { //errore nel trovare il prodotto
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				return;
				} else {	
							products.UpdateProductSeen(user.getId(),product);
							String prod_details = new Gson().toJson(prod);
							String supplier = new Gson().toJson(suppliers);
							String ranges = new Gson().toJson(range);
							String result = "[" + prod_details + "," + supplier + "," + ranges +"]";
							response.setStatus(HttpServletResponse.SC_OK);
							response.setContentType("application/json");
							response.setCharacterEncoding("UTF-8");
							response.getWriter().write(result);
							}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
				}
			}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
