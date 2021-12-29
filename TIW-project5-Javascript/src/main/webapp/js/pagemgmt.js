/**
 * Home Page Orchestrator
 */
{
    let productdetails, shoppingcart, odr, cartitem, countitem;
    pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
	    if (sessionStorage.getItem("user") == null) {
	      window.location.href = "default.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	    } // display initial content
	  }, false);

    window.addEventListener("reload", () => {
      if (sessionStorage.getItem("user") == null) {
	      window.location.href = "default.html";
	    } else {
	      pageOrchestrator.refresh(); //
	    } // display initial content
    }, false);

    var link_cart = document.getElementById("cart_details");
        link_cart.addEventListener("click", () => {
            shoppingcart.show();
        });

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
	  this.message_container_body.style.visibility = "hidden";
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
	        anchor.setAttribute('code', product.code); // set a custom HTML attribute
	        anchor.addEventListener("click", (e) => {
            var code = e.target.getAttribute("code");
	          // dependency via module parameter
	           productdetails.show(code); // the list must know the details container
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
    document.getElementById("id_category").innerHTML = "";
    document.getElementById("id_keyword").innerHTML = "";
		document.getElementById("research").style.display = "none";
		var self = this;
		productdetails.reset();
		if (keyword === ""){
				document.getElementById("research").style.display = "none";
				} else { if (category !== "Initial"){
					document.getElementById("research").style.display = "initial";
					document.getElementById("id_keyword").innerHTML = " and Keyword " + keyword;
					document.getElementById("id_category").innerHTML = " Category " + category;
          document.getElementById("menu").value = "Initial";
          document.getElementById("keyword").value = "";
					} else {
					document.getElementById("research").style.display = "initial";
					document.getElementById("id_keyword").innerHTML = " Keyword " + keyword;
          document.getElementById("keyword").value = "";
					}
				};
		if (category !== "Initial"){
			if (keyword === ""){
					document.getElementById("research").style.display = "initial";
					document.getElementById("id_category").innerHTML = " Category " + category;}
          document.getElementById("menu").value = "Initial";
		}
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
					productdetails.show(e.target.getAttribute("code")); // the list must know the details container
	        		}, false);
				anchor.href = "#";
	        	row.appendChild(descell);
	        	pricecell = document.createElement("td");
	       		pricecell.textContent = ("EUR  	" + product.price);
	        	row.appendChild(pricecell);
				container_body.appendChild(row);
	        	});
				document.getElementById("search_tab").style.display = "initial";
				container_body.style.visibility="visible";
				RecentSeenProduct.reset();
                break;
              case 400: // bad request
                showAlert("Please select a category and/or insert a keyword for starting search products!")
                document.getElementById("research").style.display = "none";
                document.getElementById("menu").value = "Initial";
                document.getElementById("keyword").value = "";
				break;
              case 404: // not found
				          document.getElementById("research").style.display = "none";
                  showAlert("Sorry! No items found for this search criteria.....");
                  document.getElementById("menu").value = "Initial";
                  document.getElementById("keyword").value = "";
                  document.getElementById("search_tab").style.display = "none";
              		document.getElementById("research").style.display = "none";
                  RecentSeenProduct.show();
                  break;
              case 500: // server error
			        document.getElementById("research").style.display = "none";
              document.getElementById("menu").value = "Initial";
              document.getElementById("keyword").value = "";
              document.getElementById("search_tab").style.display = "none";
              document.getElementById("research").style.display = "none";
              window.location.href = "errorPage.html";
              break;
            }
          }
			});
		};

	function ProductDetails(message_container, message_container_body, seller_container, seller_container_body){
		this.message_container = message_container;
   	this.message_container_body = message_container_body;
		this.seller_container = seller_container;
		this.seller_container_body = seller_container_body
   	 //Reset function
    this.reset = function (){
     	 this.message_container.style.display = "none";
         this.message_container_body.style.visibility = "hidden";
		 this.seller_container.style.display = "none";
		 this.seller_container_body.style.visibility = "hidden";
    }
		this.show = function(code){
			makeCall("GET","ProductDetailData?code=" + code, null,
			function(x){
				if (x.readyState == XMLHttpRequest.DONE) {
           			 var message = x.responseText;
            switch (x.status) {
              case 200:
					message_container_body.innerHTML = "";
					seller_container_body.innerHTML = "";
				 	var result = JSON.parse(x.responseText);
					var details = result[0];
					var suppliers = result[1];
					var ranges = result[2];
					//Create table for product details
					row = document.createElement("tr");
	        		destcell = document.createElement("td");
	       			imgcell = document.createElement("img");
	        		destcell.appendChild(imgcell);
					imgcell.setAttribute('src', 'data:image/jpeg;base64,' + details.photo);
					row.appendChild(destcell);
					dcell = document.createElement("td");
					list = document.createElement("dl");
					list_det = document.createElement("dt");
         			list_det.textContent = details.code;
					list_det.style.fontWeight = "bold";
          			list.appendChild(list_det);
          			list_ds = document.createElement("dt");
          			list_ds.textContent = details.name;
					list_ds.style.fontWeight = "bold";
          			list.appendChild(list_ds);
          			list_dt = document.createElement("dt");
          			list_dt.textContent = details.description;
          			list.appendChild(list_dt);
          			dcell.appendChild(list);
          			row.appendChild(dcell);
          			message_container_body.appendChild(row);
					//Create table for seller
      	    suppliers.forEach(function(supplier){
            newrow = document.createElement("tr");
            sellername = document.createElement("td");
            sellername.textContent = supplier.name;
            newrow.appendChild(sellername);
            rating = document.createElement("td");
            rating.textContent = supplier.rating;
            newrow.appendChild(rating);
            pricecell = document.createElement("td");
            pricecell.textContent = ("EUR  	" + supplier.prodPrice);
            newrow.appendChild(pricecell);
            freecell = document.createElement("td");
            freecell.textContent = ("EUR  	" + supplier.freeshipping);
            newrow.appendChild(freecell);
            qtacell = document.createElement("td");
            formcell = document.createElement("form");
		 	      formcell.setAttribute("method", "POST");
            field = document.createElement("input");
            field.setAttribute("type", "number");
            field.setAttribute("min", "1");
            field.setAttribute("id", "qta");
            btncell = document.createElement("input");
            btncell.setAttribute("type", "button");
            btncell.setAttribute("value","Add to Cart!");
            btncell.addEventListener("click", (e) => {
                  var quantity = e.target.closest("form").elements.namedItem("qta").value;
                  if(isNaN(quantity)){ //Check type is number
                    showAlert("Please insert a valid value!");
                  } else if (Math.sign(quantity) === 1 ){ // Check qta >= 1
                      shoppingcart.update(quantity, supplier.name, details.name, supplier.supplierid, code, supplier.prodPrice, supplier.freeshipping);
                      e.target.closest("form").elements.namedItem("qta").value = '';
                  } else
                      showAlert("Please insert a valid value!");
	     	         }, false);
            formcell.appendChild(field);
            formcell.appendChild(btncell);
            qtacell.appendChild(formcell);
            newrow.appendChild(qtacell);
            cellfortable = document.createElement("td");
              //create subtable for shipping policy
            policytable = document.createElement("table");
            newtablerow = document.createElement("tr");
            head1 = document.createElement("th");
            head1.textContent = "Minimum Articles";
            newtablerow.appendChild(head1);
            head2 = document.createElement("th");
            head2.textContent = "Maximum Articles";
            newtablerow.appendChild(head2);
            head3 = document.createElement("th");
            head3.textContent = "Shipping Fee";
            newtablerow.appendChild(head3);
            policytable.appendChild(newtablerow);
            ranges.forEach(function(range){
              if (range.supplierid === supplier.supplierid){
              newbodyrow = document.createElement("tr");
              minartcell = document.createElement("td");
              minartcell.textContent = range.minArt;
              newbodyrow.appendChild(minartcell);
              maxartcell = document.createElement("td");
                if (range.maxArt === 9999999){
                  maxartcell.textContent = "-";
                  newbodyrow.appendChild(maxartcell);
                } else {
                  maxartcell.textContent = range.maxArt;
                  newbodyrow.appendChild(maxartcell);
                }
              feecell = document.createElement("td");
              feecell.textContent = range.price;
              newbodyrow.appendChild(feecell);
              policytable.appendChild(newbodyrow);
              cellfortable.appendChild(policytable);
              newrow.appendChild(cellfortable);
              }
            });
            var c = sessionStorage.getItem("cart");
            var cjs = JSON.parse(c);
            if (c == null){
              seller_container_body.appendChild(newrow);
            } else {
              cjs.forEach(function(cj){
                if (cj.supid === supplier.supplierid){
                obj = document.createElement("td");
                obj.setAttribute("id","obejcts");
                obj.textContent = ("Items of this seller in your cart:  ");
                formitm = document.createElement("form");
    		 	      formitm.setAttribute("method", "POST");
                itm = document.createElement("input");
                itm.setAttribute("type", "button")
                itm.setAttribute("id", "itemCartSup");
                itm.setAttribute("value", cj.totalQta )
                itm.setAttribute("supplierid", cj.supid);
                itm.addEventListener("pointerover", (e) => {
                  shoppingcart.showSupplier(e.target.getAttribute("supplierid"));
                });
                formitm.appendChild(itm);
                obj.appendChild(formitm);
                newrow.appendChild(obj);
              }
            });
              seller_container_body.appendChild(newrow);
            };
          });
  		 		message_container.style.display = "initial";
					message_container_body.style.visibility = "visible";
					seller_container.style.display = "initial";
					seller_container_body.style.visibility = "visible";
          			break;
          case 500 :
          window.location.href = "errorPage.html";
          break;
					}
				}
			});
		};
	};

    function Orders(){
      this.create = function(form){
        makeCall("POST","OrdersData", form,
      function(x){
        if (x.readyState == XMLHttpRequest.DONE){
          var message = x.responseText;
          switch (x.status){
            case 200:
            var result = JSON.parse(x.responseText);
            var cart = result[0];
            var items = result[1];
            shoppingcart.remove(cart, items);
            showAlert("Order successfully completed! Thank you!");
            window.location.href = "Home.html";
            break;
            case 500:
              window.location.href = "errorPage.html";
              break;
          }
        }
      });
    }
}


    function Cart(){
      this.remove = function (cart, items){
        var shoppingCarts = sessionStorage.getItem("cart");
        var shoppingCartsItems = sessionStorage.getItem("cartItems");
        var carts = JSON.parse(shoppingCarts);
        var items = JSON.parse(shoppingCartsItems);
        if (carts.length === 1){ //ho un solo carrello
          window.sessionStorage.removeItem('cart');
          window.sessionStorage.removeItem('cartItems');
        } else { //ho altri oggetti nel carrello
            let pos = carts.indexOf(cart);
            carts.splice(pos, 1);
            let positm = items.indexOf(items);
            let number = items.lenght;
            items.splice(positm, number);
            var cartupdate = JSON.stringify(carts);
            var itmupdate = JSON.stringify(items);
            sessionStorage.setItem("cart", cartupdate);
            sessionStorage.setItem("cartItems", itmupdate);
        }
      }
      this.update = function (qta, supplier_name, prod_name, supplierid, code, prodPrice, freeshipping){
           var shoppingCarts = sessionStorage.getItem("cart");
		       var shoppingCartsItems = sessionStorage.getItem("cartItems");
		       var totalCost;
           var shippingCost;
			         if (shoppingCarts == null || shoppingCartsItems == null) { //non ho carrelli
						            totalCost = prodPrice * qta;
                        if (totalCost >= freeshipping){
                          shippingCost = 0;
                          shoppingCartsItems = [{
                                   "prod_code": code,
                                   "price": prodPrice,
                                   "qta" : qta,
                                   "supid": supplierid,
                                   "prod_name": prod_name
                                   }];
                         shoppingCarts = [{
                                  "supid" : supplierid,
                                  "supname": supplier_name,
                                  "ship": shippingCost,
                                  "Cost": totalCost,
                                  "totalQta": qta,
                                  "freeship": freeshipping
                                   }];
                        var cartJSON = JSON.stringify(shoppingCarts);
                        var cartItemsJSON = JSON.stringify(shoppingCartsItems);
                        sessionStorage.setItem("cart", cartJSON);
                        sessionStorage.setItem("cartItems", cartItemsJSON);
                        countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                        document.getElementById("cart-items").innerHTML = '';
                        document.getElementById("cart-items").innerHTML = countitem;
                        document.getElementById("qta").value='';
						            shoppingcart.show();
                        } else {
                          makeCall("GET","ShippingFeeData?number=" + qta + "&supid=" + supplierid, null, function(x){
                  				      if (x.readyState == XMLHttpRequest.DONE) {
                             			 var message = x.responseText;
                                   switch (x.status) {
                                     case 200:
                                      var result = JSON.parse(x.responseText);
                                      shippingCost = result;
                                      shoppingCartsItems = [{
            							                   "prod_code": code,
            							                   "price": prodPrice,
            							                   "qta" : qta,
            							                   "supid": supplierid,
            							                   "prod_name": prod_name
            						                     }];
            						              shoppingCarts = [{
            							                  "supid" : supplierid,
            							                  "supname": supplier_name,
            							                  "ship": shippingCost,
            							                  "Cost": totalCost,
            							                  "totalQta": qta,
                                            "freeship": freeshipping
                                             }];
            					               var cartJSON = JSON.stringify(shoppingCarts);
            					               var cartItemsJSON = JSON.stringify(shoppingCartsItems);
            					            sessionStorage.setItem("cart", cartJSON);
            					            sessionStorage.setItem("cartItems", cartItemsJSON);
                                  countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                                  document.getElementById("cart-items").innerHTML = '';
                                  document.getElementById("cart-items").innerHTML = countitem;
                                  document.getElementById("qta").value='';
                                  shoppingcart.show();
                                  productdetails.show(code);
                                  break;
                              case 500 :
                                  window.location.href = "errorPage.html";
                                  break;
                                  }
                                }
                              });
                        }

				} else { //carrello già esistente
          var incart = false;
          var initem = false;
          var cartsSessions = JSON.parse(shoppingCarts);
          var itemsSessions = JSON.parse(shoppingCartsItems);
          cartsSessions.forEach(function(cartsearch){
            if (cartsearch.supid === supplierid){
            itemsSessions.forEach(function(itemSession){
              if (itemSession.prod_code === code && itemSession.supid === supplierid){
                initem = true;
              };
            });
                incart = true;
            };
          });
          //ho già il carrello del fornitore con quell'item, quindi aggiorno qta
           if (initem && incart){
             cartsSessions.forEach(function(cartsSession){
               if (cartsSession.supid === supplierid){
               itemsSessions.forEach(function(itemSession){
                 if (itemSession.prod_code === code && itemSession.supid === supplierid){
                      itemSession.qta = parseInt(itemSession.qta, 10) + parseInt(qta, 10);
                      cartsSession.totalQta = parseInt(cartsSession.totalQta, 10) + parseInt(qta, 10);
                      var price = prodPrice * qta;
                      var costupdated = parseFloat(cartsSession.Cost) + parseFloat(price);
                      cartsSession.Cost = parseFloat(costupdated).toFixed(2);
                      if (cartsSession.Cost < cartsSession.freeship){
                        makeCall("GET","ShippingFeeData?number=" + cartsSession.totalQta + "&supid=" + cartsSession.supid, null,
                      function(x){
                        if (x.readyState == XMLHttpRequest.DONE) {
                                 var message = x.responseText;
                            switch (x.status) {
                              case 200:
                                  var result = JSON.parse(message);
                                  cartsSession.ship = result;
                                  var cartupd = JSON.stringify(cartsSessions);
                                  var cartItemsupd = JSON.stringify(itemsSessions);
                                  sessionStorage.setItem("cart", cartupd);
                                  sessionStorage.setItem("cartItems", cartItemsupd);
                                  countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                                  document.getElementById("cart-items").innerHTML = '';
                                  document.getElementById("cart-items").innerHTML = countitem;
                                  document.getElementById("qta").value='';
                                  shoppingcart.show();
                                  productdetails.show(code);
                                  break;
                                case 500:
                                  window.location.href = "errorPage.html";
                                  break;
                                }
                              }
                            });
                      } else {
                        cartsSession.ship = 0;
                        var cartupd = JSON.stringify(cartsSessions);
                        var cartItemsupd = JSON.stringify(itemsSessions);
                        sessionStorage.setItem("cart", cartupd);
                        sessionStorage.setItem("cartItems", cartItemsupd);
                        countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                        document.getElementById("cart-items").innerHTML = '';
                        document.getElementById("cart-items").innerHTML = countitem;
                        document.getElementById("qta").value='';
                        shoppingcart.show();
                        productdetails.show(code);
                        }
                    };
               });
               };
             });

           } else if (incart && !initem){ //ho già un carrello del fornitore ma non lo stesso item
                    var  newItem = {
                          "prod_code": code,
                          "price": prodPrice,
                          "qta" : qta,
                          "supid": supplierid,
                          "prod_name": prod_name
                          };
              itemsSessions.push(newItem);
              cartsSessions.forEach(function(cartsSession){
                if (cartsSession.supid === supplierid){
                  cartsSession.totalQta = parseInt(cartsSession.totalQta, 10) + parseInt(qta, 10);
                  var price = prodPrice * qta;
                  var costupdated = parseFloat(cartsSession.Cost) + parseFloat(price);
                  cartsSession.Cost = parseFloat(costupdated).toFixed(2);
                  if (cartsSession.Cost < cartsSession.freeship){
                    makeCall("GET","ShippingFeeData?number=" + cartsSession.totalQta + "&supid=" + cartsSession.supid, null,
                  function(x){
                    if (x.readyState == XMLHttpRequest.DONE) {
                             var message = x.responseText;
                        switch (x.status) {
                          case 200:
                              var result = JSON.parse(message);
                              cartsSession.ship = result;
                              var cartupd = JSON.stringify(cartsSessions);
                              var cartItemsupd = JSON.stringify(itemsSessions);
                              sessionStorage.setItem("cart", cartupd);
                              sessionStorage.setItem("cartItems", cartItemsupd);
                              countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                              document.getElementById("cart-items").innerHTML = '';
                              document.getElementById("cart-items").innerHTML = countitem;
                              document.getElementById("qta").value='';
                              shoppingcart.show();
                              productdetails.show(code);
                              break;
                            case 500:
                              window.location.href = "errorPage.html";
                              break;
                            }
                          }
                        });
                  } else {
                    cartsSession.ship = 0;
                    var cartupd = JSON.stringify(cartsSessions);
                    var cartItemsupd = JSON.stringify(itemsSessions);
                    sessionStorage.setItem("cart", cartupd);
                    sessionStorage.setItem("cartItems", cartItemsupd);
                    countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                    document.getElementById("cart-items").innerHTML = '';
                    document.getElementById("cart-items").innerHTML = countitem;
                    document.getElementById("qta").value='';
                    shoppingcart.show();
                    productdetails.show(code);
                    }
           };
        });
      } else if (!incart && !initem){ //non ho il carrello per questo fornitore
         var  totalCost = prodPrice * qta;
         if (totalCost < freeshipping){
                   makeCall("GET","ShippingFeeData?number=" + qta + "&supid=" + supplierid, null,
                 function(x){
                   if (x.readyState == XMLHttpRequest.DONE) {
                            var message = x.responseText;
                       switch (x.status) {
                         case 200:
                             var result = JSON.parse(message);
                             var newItemSup = {
                                      "prod_code": code,
                                      "price": prodPrice,
                                      "qta" : qta,
                                      "supid": supplierid,
                                      "prod_name": prod_name
                                      };
                            var newCartSup = {
                                     "supid" : supplierid,
                                     "supname": supplier_name,
                                     "ship": result,
                                     "Cost": totalCost,
                                     "totalQta": qta,
                                     "freeship": freeshipping
                                      };
                             itemsSessions.push(newItemSup);
                             cartsSessions.push(newCartSup);
                             var cartupd = JSON.stringify(cartsSessions);
                             var cartItemsupd = JSON.stringify(itemsSessions);
                             sessionStorage.setItem("cart", cartupd);
                             sessionStorage.setItem("cartItems", cartItemsupd);
                             countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                             document.getElementById("cart-items").innerHTML = '';
                             document.getElementById("cart-items").innerHTML = countitem;
                             document.getElementById("qta").value='';
                             shoppingcart.show();
                             productdetails.show(code);
                             break;
                           case 500:
                             window.location.href = "errorPage.html";
                             break;
                           }
                         }
                       });
                 } else {
                   var shippingCost = 0;
                   var newItemSup = {
                            "prod_code": code,
                            "price": prodPrice,
                            "qta" : qta,
                            "supid": supplierid,
                            "prod_name": prod_name
                            };
                  var newCartSup = {
                           "supid" : supplierid,
                           "supname": supplier_name,
                           "ship": shippingCost,
                           "Cost": totalCost,
                           "totalQta": qta,
                           "freeship": freeshipping
                            };
                   var cartupd = JSON.stringify(newCartSup);
                   var cartItemsupd = JSON.stringify(newItemSup);
                   sessionStorage.setItem("cart", cartupd);
                   sessionStorage.setItem("cartItems", cartItemsupd);
                   countitem = parseInt(countitem, 10) + parseInt(qta, 10);
                   document.getElementById("cart-items").innerHTML = '';
                   document.getElementById("cart-items").innerHTML = countitem;
                   document.getElementById("qta").value='';
                   shoppingcart.show();
                   productdetails.show(code);
                   }

      } ;
                };

    };
		this.show = function(){
					var cartsObj = sessionStorage.getItem("cart");
					var itemsObj = sessionStorage.getItem("cartItems");
					var carts = JSON.parse(cartsObj);
					var items = JSON.parse(itemsObj);
          var modal = document.getElementById("id01");
          var span = document.getElementsByClassName("close")[0];
					document.getElementById("id_cart_body").innerHTML='';
					carts.forEach(function(cart){
						 row = document.createElement("tr");
	        			 sellname = document.createElement("td");
	       				 sellname.textContent=cart.supname;
	        			 row.appendChild(sellname);
						 cellfortableprod = document.createElement("td");
						//subtable for product list
						 itemstable = document.createElement("table");
         				 newtbrow = document.createElement("tr");
          				 hd1 = document.createElement("th");
            			 hd1.textContent = "Product Code";
            			 newtbrow.appendChild(hd1);
            			 hd2 = document.createElement("th");
           				 hd2.textContent = "Product Name";
           				 newtbrow.appendChild(hd2);
          				 hd3 = document.createElement("th");
           				 hd3.textContent = "Qta";
           				 newtbrow.appendChild(hd3);
           				 itemstable.appendChild(newtbrow);
           				 items.forEach(function(item){
							if(item.supid === cart.supid) {
								        newbdrow = document.createElement("tr");
              					     prdcodecell = document.createElement("td");
             					       prdcodecell.textContent = item.prod_code;
              					     newbdrow.appendChild(prdcodecell);
								             prdnamecell = document.createElement("td");
								             prdnamecell.textContent = item.prod_name;
								             newbdrow.appendChild(prdnamecell);
								             qtacell = document.createElement("td");
								             qtacell.textContent = item.qta;
								             newbdrow.appendChild(qtacell);
				                             itemstable.appendChild(newbdrow);

								}
                cellfortableprod.appendChild(itemstable);
                row.appendChild(cellfortableprod);
							});
						//TotalCost cell
						costcell = document.createElement("td");
						costcell.textContent = cart.Cost;
						row.appendChild(costcell);
						shipfeecell = document.createElement("td");
						shipfeecell.textContent = cart.ship;
						row.appendChild(shipfeecell);
            //Checkout
            var itmlist = [];
            var count = 0;
            items.forEach(function(item){
              if (item.supid === cart.supid){
                itmlist[count] = item;
                count ++;
              }
            });
            ckout = document.createElement("td");
            ckout.setAttribute("class", "nocolor");
            formitm = document.createElement("form");
            formitm.setAttribute("method", "POST");
            formitm.setAttribute("action", "#");
            itm = document.createElement("input");
            itm.setAttribute("type", "button")
            itm.setAttribute("id", "Checkout");
            itm.setAttribute("value", "Checkout!");
            itm1 = document.createElement("input");
            itm1.setAttribute("type", "hidden")
            itm1.setAttribute("id", "Cart");
            itm1.setAttribute("name", "Cart");
            itm1.setAttribute("value", JSON.stringify(cart));
            itm2 = document.createElement("input");
            itm2.setAttribute("type", "hidden")
            itm2.setAttribute("id", "ItemList");
            itm2.setAttribute("name", "ItemList");
            itm2.setAttribute("value", JSON.stringify(itmlist));
            itm3 = document.createElement("input");
            itm3.setAttribute("type", "hidden");
            itm3.setAttribute("id", "supplierid");
            itm3.setAttribute("name", "supplierid");
            itm3.setAttribute("value", cart.supid);
            itm.addEventListener("click", (e) => {
            var form = e.target.closest("form");
            //create Order
            odr.create(form);
            });
            formitm.appendChild(itm);
            formitm.appendChild(itm1);
            formitm.appendChild(itm2);
            formitm.appendChild(itm3);
            ckout.appendChild(formitm);
            row.appendChild(ckout);
            document.getElementById("id_cart_body").appendChild(row);
            modal.style.display = "block";
            document.getElementById("id_cart_body").style.visibility = "visible";
            span.onclick = function() {
              modal.style.display = "none";
              }
              window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                    }
                  }
		      });
    };
    this.showSupplier = function(supplierid){
          var sellid = supplierid;
					var cartsObj = sessionStorage.getItem("cart");
					var itemsObj = sessionStorage.getItem("cartItems");
					var carts = JSON.parse(cartsObj);
					var items = JSON.parse(itemsObj);
          var overlay = document.getElementById("ShoppingSupplier");
          var link = document.getElementsByClassName("close")[0];
          var relevantCart = carts.filter(function(cart){
              return cart.supid == supplierid;
          });
					document.getElementById("id_cartSupplier_body").innerHTML='';
					carts.forEach(function(cs){
            if(cs.supid == sellid){
                      document.getElementById("sellername").innerHTML= cs.supname;
						          row = document.createElement("tr");
	        			      cellfortableprod = document.createElement("td");
						         //subtable for product list
						          itemstable = document.createElement("table");
         				      newtbrow = document.createElement("tr");
          				    hd1 = document.createElement("th");
            			    hd1.textContent = "Product Code";
            			    newtbrow.appendChild(hd1);
            			    hd2 = document.createElement("th");
           				    hd2.textContent = "Product Name";
           				    newtbrow.appendChild(hd2);
          				    hd3 = document.createElement("th");
           				    hd3.textContent = "Qta";
           				    newtbrow.appendChild(hd3);
                      hd4 = document.createElement("th");
                      hd4.textContent = "Price per Unit";
                      newtbrow.appendChild(hd4);
           				    itemstable.appendChild(newtbrow);
           				    items.forEach(function(item){
							                 if(item.supid === cs.supid) {
								                         newbdrow = document.createElement("tr");
              					                 prdcodecell = document.createElement("td");
             					                   prdcodecell.textContent = item.prod_code;
              					                 newbdrow.appendChild(prdcodecell);
								                         prdnamecell = document.createElement("td");
								                         prdnamecell.textContent = item.prod_name;
								                         newbdrow.appendChild(prdnamecell);
								                         qtacell = document.createElement("td");
								                         qtacell.textContent = item.qta;
                                         newbdrow.appendChild(qtacell);
                                         pricecell = document.createElement("td");
                                         pricecell.textContent = ("EUR " + item.price);
                                         newbdrow.appendChild(pricecell);
				                                 itemstable.appendChild(newbdrow);
								                               }
                      cellfortableprod.appendChild(itemstable);
                      row.appendChild(cellfortableprod);
							});
						//TotalCost cell
						costcell = document.createElement("td");
						costcell.textContent = ("EUR " + cs.Cost);
						row.appendChild(costcell);
						shipfeecell = document.createElement("td");
						shipfeecell.textContent = ("EUR " + cs.ship);
						row.appendChild(shipfeecell);
            document.getElementById("id_cartSupplier_body").appendChild(row);
            overlay.style.display = "block";
            document.getElementById("id_cartSupplier_body").style.visibility = "visible";
            document.getElementById("ShoppingSupplier").style.width = "80%";
            link.onclick = function() {
              overlay.style.display = "none";
              }
              window.onclick = function(event) {
                if (event.target == overlay) {
                    overlay.style.display = "none";
                    }
                  }
              }

		      });
    };
};

    function PageOrchestrator (){
      //initial page load
      this.start = function(){
		//Set personal message
        personalMessage = new PersonalMessage(document.getElementById ("id_username"));
        personalMessage.show();
		//Initialize product details
		productdetails = new ProductDetails(document.getElementById("id_prod_detail"),document.getElementById("id_prod_detail_body"), document.getElementById("id_purchase"), document.getElementById("id_purchase_body") );
		productdetails.reset();
		//Show recent Prods or in offer
		  RecentSeenProduct = new RecentSeenProduct(document.getElementById("id_recent_tab"),document.getElementById("id_recent_body"));
 	   	  RecentSeenProduct.reset();
		  RecentSeenProduct.show();
		//Show Category List
		categories = new ShowCategories();
		categories.show();
		document.getElementById("search_tab").style.display = "none";
		document.getElementById("research").style.display = "none";
		//Order
		odr = new Orders();
		//Shopping Cart
		shoppingcart = new Cart();
      if (sessionStorage.getItem("cartItems") === null){
          countitem = 0;
          document.getElementById("cart-items").innerHTML = countitem;
      } else {
        countitem = 0;
        var carts = JSON.parse(sessionStorage.getItem("cart"));
        carts.forEach(function(cart){
            countitem = parseInt(countitem, 10) + parseInt(cart.totalQta, 10);
          });
        document.getElementById("cart-items").innerHTML = countitem;
      }
         						 }
      //Hidden overlay windows
        document.getElementById("ShoppingSupplier").style.width = "0%";
        document.getElementById("ShoppingSupplier").style.display = "none";
  		 };

      this.refresh = function(){
        if (sessionStorage.getItem("cartItems") === null){
            countitem = 0;
            document.getElementById("cart-items").innerHTML = countitem;
        } else {
          countitem = 0;
          var carts = JSON.parse(sessionStorage.getItem("cart"));
          carts.forEach(function(cart){
              countitem = parseInt(countitem, 10) + parseInt(cart.totalQta, 10);
            });
          document.getElementById("cart-items").innerHTML = countitem;
        }
        document.getElementById("ShoppingSupplier").style.width = "0%";
        document.getElementById("ShoppingSupplier").style.display = "none";
      };
	};
