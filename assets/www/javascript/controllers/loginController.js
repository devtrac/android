function LoginController(){
    // Login controller object
}

LoginController.prototype.show = function(){
	console.log("In show of login controller.");
    screens.show("login");
}

LoginController.prototype.login = function(){
    var userName = $("#username").val();
    var password = $("#password").val();
    
    if (!userName || !password) {
        alert("Please enter username and password.");
        return;
    }

//    var renderView = function(){
//        navigator.store.put(function(){
//            devtrac.dataStore.getQuestions(function(){
//                devtrac.dataStore.getPlaces(function(){
//                    devtrac.dataStore.getProfiles(function(){
//                        if (devtrac.questions && devtrac.places && devtrac.profiles) {
//                            // Check if fieldtrip is locally available for current user
//                            devtrac.dataStore.retrieveFieldTrip(function(){
//                                if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
//                                    fieldTripController.showTripReports();
//                                    return;
//                                }
//                                // No fieldtrip exist for user. Download the details.
//                                devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
//                            });
//                        }
//                        else {
//                            devtrac.dataPull.questions(function(){
//                                // Check if fieldtrip is locally available for current user
//                                devtrac.dataStore.retrieveFieldTrip(function(){
//                                    if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
//                                        fieldTripController.showTripReports();
//                                        return;
//                                    }
//                                    // No fieldtrip exist for user. Download the details.
//                                    devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
//                                });
//                            });
//                        }
//                    })
//                });
//            });
//            
//        }, function(){
//            devtrac.common.logAndShowGenericError("Error in saving: " + devtrac.user.name);
//        }, "user", JSON.stringify(devtrac.user));
//    };
//    
	var renderWelcomeView = function(){
      alert("welcome " + userName);
	  devtrac.loginController.show();	
	};
	
    var loginFailed = function(){
        devtrac.loginController.show();
    };
    screens.show("loading");
	devtrac.user.authenticate(userName, password, renderWelcomeView, loginFailed);
};


LoginController.prototype.logout = function(){
	try {
    $.ajax({
     url: "http://devtrac.mountbatten.net:8001/api/user/logout.json",
     type: 'post',
     dataType: 'json',
     error: function (XMLHttpRequest, textStatus, errorThrown) {
       alert('button_logout - failed to logout');
       console.log(JSON.stringify(XMLHttpRequest));
       console.log(JSON.stringify(textStatus));
       console.log(JSON.stringify(errorThrown));
     },
     success: function (data) {
       alert("You have been logged out.");
     }
 });
}
catch (error) { alert("button_logout - " + error); }
}

