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

import ibuy.ria.beans.PriceRange;
import ibuy.ria.beans.Product;
import ibuy.ria.beans.Supplier;
import ibuy.ria.beans.User;
import ibuy.ria.dao.ProductDAO;
import ibuy.ria.dao.SupplierDAO;
import ibuy.ria.utilities.ConnectionHandler;

/**
 * Servlet implementation class ShippingFeeData
 */
@WebServlet("/ShippingFeeData")
public class ShippingFeeData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ShippingFeeData() {
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
				SupplierDAO supp = new SupplierDAO(connection);
				Float price = (float) 0;
				String supid;
				Integer id;
				Integer articles = 0;
				try { //Cerco il prezzo di spedizione
					articles = Integer.parseInt(request.getParameter("number"));
					supid = StringEscapeUtils.escapeJava(request.getParameter("supid"));
					id = Integer.parseInt(supid);
							if (articles == null || supid == null) { //errore nel trovare il prodotto
									response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
									return;
						} else {	
									price = supp.CalculateShippingCost(articles, id);
									String message = new Gson().toJson(price);
									response.setStatus(HttpServletResponse.SC_OK);
									response.setContentType("application/json");
									response.setCharacterEncoding("UTF-8");
									response.getWriter().write(message);
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
