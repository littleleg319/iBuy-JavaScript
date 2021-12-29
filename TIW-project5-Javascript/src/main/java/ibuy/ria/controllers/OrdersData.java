package ibuy.ria.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.thymeleaf.context.WebContext;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import ibuy.ria.beans.Cart;
import ibuy.ria.beans.CartItem;
import ibuy.ria.beans.Order;
import ibuy.ria.beans.OrderItem;
import ibuy.ria.dao.OrderDAO;
import ibuy.ria.beans.PriceRange;
import ibuy.ria.beans.Product;
import ibuy.ria.beans.Supplier;
import ibuy.ria.beans.User;
import ibuy.ria.dao.ProductDAO;
import ibuy.ria.dao.SupplierDAO;
import ibuy.ria.utilities.ConnectionHandler;

/**
 * Servlet implementation class OrdersData
 */
@WebServlet("/OrdersData")
@MultipartConfig
public class OrdersData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection; 
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OrdersData() {
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
		List<Order> myorders = new ArrayList<Order>();
		List<OrderItem> order_items = new ArrayList<OrderItem>();
		
		OrderDAO orders = new OrderDAO(connection);
		//cerco i miei ordini
		myorders = orders.findOrderByUserid(user.getId());
		//non ho ordini --> 404
		if (myorders == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		} else { //ho ordini --> cerco i dettagli degli item per ordine
			for (Order i : myorders) {
				order_items.addAll(orders.findItemsByOrderId(i.getOrderId()));
			}
			String orderList = new Gson().toJson(orders);
			String itemsList = new Gson().toJson(order_items);
			String result = "[" + orderList + "," + itemsList +"]";
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(result);
			return;
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//Inizializzazione variabili
				Integer supplierid = null;
				String cart = null;
				String items = null;
				String supid = null;
				OrderDAO createOrder = new OrderDAO(connection);
				HttpSession session = request.getSession();
				
		//Get parametri
				User user = (User) session.getAttribute("user");
				cart = (String) request.getParameter("Cart");
				items = (String) request.getParameter("ItemList");
				supid = (String) request.getParameter("supplierid");
				supplierid = Integer.parseInt(supid);
		//Converto JSON in  oggetti Cart e CartItem
				Gson gcart = new Gson();
				Cart shop = gcart.fromJson(cart, Cart.class);
				String supname = shop.getSupname();
				
				Gson gitems = new Gson();
				CartItem[] itms = gitems.fromJson(items, CartItem[].class);
				List <CartItem> itm = Arrays.asList(itms);
				
		//controllo che non siano vuoti
				if (shop == null || itms == null) {
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					return;
				}
		//creo ordine
				Integer esito = createOrder.CreateOrder(user.getId(),itm, shop);
							if (esito == 0) { //tutto ok --> rimuovo il carrello e gli items
								String result = "[" + cart + "," + items +"]";
								response.setStatus(HttpServletResponse.SC_OK);
								response.setContentType("application/json");
								response.setCharacterEncoding("UTF-8");
								response.getWriter().write(result);
								return;
								} else { //errore nella creazione ordine
								response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
								return;
						}
		}
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
