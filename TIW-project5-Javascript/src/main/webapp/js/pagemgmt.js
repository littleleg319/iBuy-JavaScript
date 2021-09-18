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

    function PageOrchestrator (){
      this.start = function(){
        personalMessage = new PersonalMessage(document.getElementById ("id_username"));
        personalMessage.show();
      }
    }
};
