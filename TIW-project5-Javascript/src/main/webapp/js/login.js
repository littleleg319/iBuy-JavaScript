/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'CheckLogin',form,
        function(x) {
          if (x.readyState == XMLHttpRequest.DONE) {
            var message = x.responseText;
            switch (x.status) {
              case 200:
                window.sessionStorage.setItem('userid', message);
                window.location.href = "Home.html";
                break;
              case 400: // bad request
                showAlert("Please fill with your Username and Password!")
                break;
              case 401: // unauthorized
                  showAlert("Wrong Username and/or Password!");
                  break;
              case 500: // server error
              window.location.href = "errorPage.html";
              break;
            }
          }
        }
      );
    } else {
    	 form.reportValidity();
    }
  });

})();
