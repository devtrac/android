function DataStore(){

}

DataStore.prototype.init = function(callback){
    var userValue = devtrac.localStore.get('user');
    if (userValue) {
        devtrac.user = JSON.parse(userValue);
        devtrac.dataStore.getQuestions(function(){
            devtrac.dataStore.getPlaces(function(){
                devtrac.dataStore.getProfiles(function(){
                    devtrac.dataStore.retrieveFieldTrip(callback);
                });
            });
        });
    }
    else {
        callback();
    }
}

DataStore.prototype.retrieveFieldTrip = function(callback){
    console.log("Trying to retreive a field trip for user: " + devtrac.user.name);
    function portOldImages(){
        $.each(devtrac.fieldTrip.sites, function(index, site){
            if (site.photos && site.photos.length) {
                var photos = {};
                $.each(site.photos, function(photo){
                    photos[photo] = null;
                });
                devtrac.fieldTrip.sites[index].photos = photos;
            }
        });
    }
    var value = devtrac.localStore.get(devtrac.user.name);
    if (value) {
	    devtrac.fieldTrip = JSON.parse(value);
	    portOldImages();
	    if (callback) {
	        callback();
	    }
    }else{
	callback();	
	}
}

DataStore.prototype.removeFieldTrip = function(callback){
    devtrac.localStore.remove(devtrac.user.name);
	 if (callback) {
            callback();
        }
}

DataStore.prototype.saveFieldTrip = function(callback){
//    navigator.log.debug("Storing field trip: " + devtrac.fieldTrip.title);
    devtrac.localStore.put(devtrac.user.name, JSON.stringify(devtrac.fieldTrip));
	if (callback) {
		callback();
	}
}

DataStore.prototype.updateTripImageFid = function(imagePath, fid, callback){
    var imageFound = false;
    $.each(devtrac.fieldTrip.sites, function(index, site){
        for (var filePath in site.photos) {
            if (imagePath == filePath) {
                devtrac.fieldTrip.sites[index].photos[imagePath] = fid;
                imageFound = true;
            }
        }
    });
    
    if (imageFound) {
        devtrac.dataStore.saveFieldTrip(function(){
            if (callback) {
                callback('Images updated and saved');
            }
        });
    }
    else {
        if (callback) {
            callback('No image found to update');
        }
    }
}

DataStore.prototype.saveCurrentSite = function(callback){
    $.each(devtrac.fieldTrip.sites, function(index, site){
        if (site.id == devtrac.currentSite.id) {
            devtrac.fieldTrip.sites[index] = devtrac.currentSite;
            devtrac.dataStore.saveFieldTrip(callback);
        }
    });
}

DataStore.prototype.getQuestions = function(callback){
    var value = devtrac.localStore.get('questions');
	 if (value){
        devtrac.questions = JSON.parse(value);
        if (callback) {
            callback();
        }
      }else {
            callback();
      }
}

DataStore.prototype.getPlaces = function(callback){
    var value = devtrac.localStore.get('placeTypes');
     if (value){
        devtrac.places = JSON.parse(value);
        if (callback) {
            callback();
        }
      }else {
            callback();
      }
}

DataStore.prototype.getProfiles = function(callback){
    var value = devtrac.localStore.get('profiles');
     if (value){
        devtrac.profiles = JSON.parse(value);
        if (callback) {
            callback();
        }
      }else {
            callback();
      }
}



