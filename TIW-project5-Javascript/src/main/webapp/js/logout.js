/**
 * Logout Management
 */
{
 function logout () { // avoid variables ending up in the global scope
       makeCall("GET", 'Logout', null,
         function(x) {
           if (x.readyState == XMLHttpRequest.DONE) {
             switch (x.status) {
               case 200:
                  window.sessionStorage.removeItem('user');
                  window.sessionStorage.removeItem('cart');
                  window.sessionStorage.removeItem('cartItems');
                  window.location.href = "default.html";
                  break;
               case 500: // server error
               window.location.href = "errorPage.html";
               break;
             };
           };
         });
     };
 };
