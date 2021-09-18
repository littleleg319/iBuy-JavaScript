/**
 * Home Page Orchestrator
 */
{
    pageOrchastrator = new PageOrchastrator();

    window.addEventListener("load", () => {
	    if (sessionStorage.getItem("userid") == null) {
	      window.location.href = "default.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	    } // display initial content
	  }, false);


    function PersonalMessage (message_container){
        this.user = "<%=session.getAttribute('user')%>";
        this.show = function(){
          message_container.textContent = this.user.name;
        }
    }

    function PageOrchestrator (){
      this.start = function(){
        personalMessage = new PersonalMessage(id_username);
        document.getDocumentById ("id_username");
        personalMessage.show();
      }
    }
};
