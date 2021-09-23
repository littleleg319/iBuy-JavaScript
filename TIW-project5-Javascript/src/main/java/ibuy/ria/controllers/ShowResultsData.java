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

import ibuy.ria.beans.Product;
import ibuy.ria.beans.User;
import ibuy.ria.dao.ProductDAO;
import ibuy.ria.utilities.ConnectionHandler;

/**
 * Servlet implementation class ShowResultsData
 */
@WebServlet("/ShowResultsData")
public class ShowResultsData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ShowResultsData() {
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
		//Dichiarazione parametri
				HttpSession session = request.getSession();
				User user = (User) session.getAttribute("user");
				List<Product> prods_list = new ArrayList<Product>();
				ProductDAO products = new ProductDAO(connection);
				String keyword = null;
				String code = null;
				String category = null;
				
				//get paramteri
					try { 
						//Controllo che mi abbiano dato la chiave di ricerca e sono nella prima pagina
						code = StringEscapeUtils.escapeJava(request.getParameter("code"));
						keyword = StringEscapeUtils.escapeJava(request.getParameter("keyword"));
						category = StringEscapeUtils.escapeJava(request.getParameter("category"));
						
						//Nessun parametro --> Richiedere i parametri HTTP 400
						if (keyword == null & code == null & category.equals("Initial")) {
							response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
							return;
							//ho solo keyword
						} else if (code == null && category.equals("Initial")) { 
						//sono nell'overview dei risultati e non è stata selezionata una categoria
							prods_list = products.findProductsByKey(keyword); 
							if (prods_list == null) { //no prodotti trovati 404
								response.setStatus(HttpServletResponse.SC_NOT_FOUND);
								return;
							} else {
								//ho trovato dei prodotti
								String json = new Gson().toJson(prods_list);
								response.setStatus(HttpServletResponse.SC_OK);
								response.setContentType("application/json");
								response.setCharacterEncoding("UTF-8");
								response.getWriter().write(json);
							}
						} //sono nell'overview dei risultati ed � stata scelta una categoria per ricerca 
						else if (code == null && !(category == null)) {
							prods_list = products.findProductsByCategory(category, keyword);
							if (prods_list == null) {  //no prodotti trovati 404
								response.setStatus(HttpServletResponse.SC_NOT_FOUND);
								return;
							} else {
								//ho trovato dei prodotti
								String json = new Gson().toJson(prods_list);
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
