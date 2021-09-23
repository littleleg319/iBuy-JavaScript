/**
 * Home Page Orchestrator
 */
{
    pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
	    if (sessionStorage.getItem("user") == null) {
	      window.location.href = "default.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	    } // display initial content
	  }, false);


    function PersonalMessage (message_container){
			var user = sessionStorage.getItem("user");
			var usr = JSON.parse(user);
            this.show = function(){
          message_container.textContent = usr.name;
        }
    }

	function RecentSeenProduct (message_container, message_container_body){
    this.message_container = message_container;
    this.message_container_body = message_container_body;
    //Reset function
    this.reset = function (){
      this.message_container.style.visibility = "hidden";
      document.getElementById("recent_text").style.visibility = "hidden";
    }
    //show function
		this.show = function() {
			var self = this;
			makeCall("GET", "ShowRecentProducts", null, function(x) {
				if (x.readyState == 4){
					 var message = x.responseText;
					if (x.status == 200){
            document.getElementById("recent_text").style.visibility = "visible";
            document.getElementById("id_recent_tab").style.visibility = "visible";
            document.getElementById("id_recent_body").style.visibility = "visible";
            var products = JSON.parse(x.responseText);
            if (products.lenght == 0) {//No products returned --> Error
                    window.location.href = "errorPage.html";
                    } else {
                    self.update(products);
                  }
					}
					else if (x.status == 500){
						window.location.href = "errorPage.html";
					}
				}
			});
		};
		//update Table View Function
    this.update = function(arrayProducts) {
	      var elem, i, row, destcell, descell, linkcell, anchor;
	        this.message_container_body.innerHTML = ""; // empty the table body
	      // build updated list
	      var self = this;
	      arrayProducts.forEach(function(product) { // self visible here, not this
	        row = document.createElement("tr");
	        destcell = document.createElement("td");
	        destcell.textContent = product.name;
	        row.appendChild(destcell);
	        descell = document.createElement("td");
	        descell.textContent = product.description;
	        row.appendChild(descell);
	        linkcell = document.createElement("td");
	        anchor = document.createElement("a");
	        linkcell.appendChild(anchor);
	        linkText = document.createTextNode("Show details");
	        anchor.appendChild(linkText);
	        //anchor.missionid = mission.id; // make list item clickable
	        anchor.setAttribute('code', product.code); // set a custom HTML attribute
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter
	          ProductDetails.show(e.target.getAttribute("code")); // the list must know the details container
	        }, false);
	        anchor.href = "#";
	        row.appendChild(linkcell);
	        self.message_container_body.appendChild(row);
	      });
	      this.message_container.style.visibility = "visible";

	    }
	};

	function ShowCategories(){
		this.show = function(){
			makeCall("GET", "ShowCategories", null, function(x) {
				if (x.readyState == 4){
					if (x.status == 200){
						select = document.getElementById("menu");
						var categories = JSON.parse(x.responseText);
						for (var i = 0; i < categories.length +1; i++){
							var opt = document.createElement("option");
							if (i == 0){
								opt.value = "Initial";
								opt.innerHTML = "Select a category:"
								select.appendChild(opt);
							} else {
							opt.value = categories[i-1];
							opt.innerHTML = categories[i-1];
							select.appendChild(opt);
									}
							}
					} else {
							window.location.href = "errorPage.html";
							}
					}
				});
	};
};

	
	function Search(){
		var e1 = document.getElementById("Find");
		var form = e1.closest("form");
		var elem_cat = document.getElementById("menu");
		var elem_key = document.getElementById("keyword");
		var category = elem_cat.value;
		var keyword = elem_key.value;
		var container_body = document.getElementById("search_body");
		var self = this;
			
			container_body.style.visibility="hidden";
				makeCall("GET","ShowResultsData?category=" + category + "&keyword=" + keyword, form, 
			function(x){
				if (x.readyState == XMLHttpRequest.DONE) {
           			 var message = x.responseText;
            switch (x.status) {
              case 200:
				container_body.innerHTML = "";
				 var products = JSON.parse(x.responseText);
				 products.forEach(function(product){
				row = document.createElement("tr");
	        	destcell = document.createElement("td");
	       		destcell.textContent = product.code;
	        	row.appendChild(destcell);
	       		descell = document.createElement("td");
				anchor = document.createElement("a");
				descell.appendChild(anchor);
				linkText = document.createTextNode(product.name);
				anchor.appendChild(linkText);
				anchor.setAttribute('code', product.code);
				anchor.addEventListener("click", (e) => {
					ProductDetails.show(e.target.getAttribute("code")); // the list must know the details container
	        		}, false);
				anchor.href = "#";
	        	row.appendChild(descell);
	        	pricecell = document.createElement("td");
	       		pricecell.textContent = ("EUR" + product.price);
	        	row.appendChild(pricecell);
				container_body.appendChild(row);
	        	});
				document.getElementById("search_tab").style.display = "initial";
				container_body.style.visibility="visible";
				if (keyword !== null){
					document.getElementById("keyword").innerHTML = keyword;
				};
				if (category !== null || category !== "Initial"){
					document.getElementById("category").innerHTML = category;
				};
                break;
              case 400: // bad request
                showAlert("Please select a category and/or insert a keyword for starting search products!")
                document.getElementById("research").style.display = "none";
				break;
              case 404: // not found
				  document.getElementById("research").style.display = "none";
                  showAlert("Sorry! No items found for this search criteria.....");
                  break;
              case 500: // server error
			  document.getElementById("research").style.display = "none";
              window.location.href = "errorPage.html";
              break;
            }
          }
			});
		}; 
	
    function PageOrchestrator (){
      //initial page load
      this.start = function(){
		//Set personal message
        personalMessage = new PersonalMessage(document.getElementById ("id_username"));
        personalMessage.show();
		//Show recent Prods or in offer
		  RecentSeenProduct = new RecentSeenProduct(document.getElementById("id_recent_tab"),document.getElementById("id_recent_body") );
 	    RecentSeenProduct.reset();
		  RecentSeenProduct.show();
		//Show Category List
		categories = new ShowCategories();
		categories.show();
		document.getElementById("search_tab").style.display = "none";
		document.getElementById("research").style.display = "none";
     						 }
  		 };
						
	}
