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
     var renderView =function(){
	 devtrac.localStore.put('user', JSON.stringify(devtrac.user));
     devtrac.dataStore.getQuestions(function(){
        devtrac.dataStore.getPlaces(function(){
            devtrac.dataStore.getProfiles(function(){
                if (devtrac.questions && devtrac.places && devtrac.profiles) {
                    // Check if fieldtrip is locally available for current user
                    devtrac.dataStore.retrieveFieldTrip(function(){
                        if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
                            fieldTripController.showTripReports();
                            return;
                        }
                        // No fieldtrip exist for user. Download the details.
                        setTimeout(function(){
                            devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
                        }, 1000);
                    });
                }
                else {
                    devtrac.dataPull.questions(function(){
                        // Check if fieldtrip is locally available for current user
                        devtrac.dataStore.retrieveFieldTrip(function(){
                            if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
                                fieldTripController.showTripReports();
                                return;
                            }
                            // No fieldtrip exist for user. Download the details.
                            setTimeout(function(){
                                devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
                            }, 1000);
                        });
                    });
                }
            })
        });
    });
  };
    var loginFailed = function(){
        devtrac.loginController.show();
    };
    screens.show("loading");
	devtrac.user.authenticate(userName, password, renderView, loginFailed);
};


LoginController.prototype.logout = function(){
    logout(function(){
        console.log("Log out successfully");
	},function(){
        console.log("Log out failed");
    })

    devtrac.loginController.show();
}

