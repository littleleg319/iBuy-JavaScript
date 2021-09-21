package ibuy.ria.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;

import ibuy.ria.beans.Product;
import ibuy.ria.beans.User;
import ibuy.ria.dao.ProductDAO;
import ibuy.ria.utilities.ConnectionHandler;

/**
 * Servlet implementation class ProductData
 */
@WebServlet("/ShowRecentProducts")
public class ShowRecentProducts extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ShowRecentProducts() {
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
		//Diachiarazione variabili
				HttpSession session = request.getSession();
				User user = (User) session.getAttribute("user");
				String keyword = null;
				String category = null;
				String code = null;
				List<Product> recent_prod = new ArrayList<Product>();
				ProductDAO prods = new ProductDAO(connection);
				
				//get paramteri
				try { 
					//Controllo che mi abbiano dato la chiave di ricerca e sono nella prima pagina
					code = StringEscapeUtils.escapeJava(request.getParameter("code"));
					keyword = StringEscapeUtils.escapeJava(request.getParameter("keyword"));
				//	category = StringEscapeUtils.escapeJava(request.getParameter("category"));
					
					//sono nella view dei product senza aver ricercato nulla
		//			if (keyword == null & code == null & category.equals("Initial")) {
					if (keyword == null & code == null) {
					recent_prod = prods.findLastProductByUser(user.getId());
						
						if (recent_prod == null) {
							response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
							return;
						} else {
							String json = new Gson().toJson(recent_prod);
							response.setStatus(HttpServletResponse.SC_OK);
							response.setContentType("application/json");
							response.setCharacterEncoding("UTF-8");
							response.getWriter().write(json);
						}
					}
				} catch (SQLException e) {
					e.printStackTrace();
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
