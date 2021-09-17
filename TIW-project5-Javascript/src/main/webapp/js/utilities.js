/**
 * Function Cross-Used
 */

 function makeCall(method, url, formElement, cback, reset = true) {
	    var req = new XMLHttpRequest(); // visible by closure
	    req.onreadystatechange = function() {
	      cback(req)
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
	  }

  function showAlert(message){
      // Get the modal
      var modal = document.getElementById("myModal");
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
        // When the user clicks the button, open the modal
        document.getElementById("errMessage").innerHTML =  message;
        modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
          }

          // When the user clicks anywhere outside of the modal, close it
          window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                }
              }
            };
