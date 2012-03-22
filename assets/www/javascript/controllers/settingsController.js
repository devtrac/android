function SettingsController(){

}

SettingsController.prototype.show = function(){
    screens.show("settings");
}

SettingsController.prototype.updateQuestionsPlaces = function(){
    devtrac.dataPull.questions(function(){
        setTimeout(function(){
            alert("Questions, profiles and places updated successfully.");
            devtrac.settingsController.show();
        }, 1000);
    });
}

SettingsController.prototype.wipeout = function(){
    screens.show("delete_confirm");
}

SettingsController.prototype.performWipeout = function(){
    devtrac.localStore.clear();
    alert("All application data deleted. Application will exit.");
    navigator.app.exitApp();
}

SettingsController.prototype.uploadData = function(){
	if (devtrac.dataPush.isAllSitesUploaded()){
		alert('No site has been changed since last synchronization.');
		return;
	}

    screens.show("upload_progress");
    $('.upload_progress_log').html("");
    devtrac.dataPush.uploadData(function(msg){
        $('.upload_progress_log').append("<br/>" + msg);
    }, function(msg){
        alert(msg);
        $('.upload_progress_log').html("");
        fieldTripController.showTripReports();
    }, function(msg){
        alert(msg);
        $('.upload_progress_log').html("");
        fieldTripController.showTripReports();
    });
}

SettingsController.prototype.showLog = function(){
    navigator.log.show(function(success){
        if (!success) {
            alert("Can't open log viewer");
        }
    });
}
SettingsController.prototype.setDebugMode = function(){
    navigator.log.getDebug(function(isDebugOn){
        var debugMode = !isDebugOn;
	    navigator.log.setDebug(debugMode, function(success){
	        var hint = "Debug mode is " + (debugMode ? "ON" : "OFF") + ".";
	        navigator.log.log(hint);
        });
    });
}
