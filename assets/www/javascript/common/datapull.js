function DataPull(){
    this.fieldTrip = new FieldTrip();
    this.sites = [];
    this.sitesForActionItems = [];
}

DataPull.prototype.questions = function(callback){
    $("#status").html("");
	console.log("Requesting question download.");
    var questionSuccess = function(questionResponse){
        if (devtrac.common.hasError(questionResponse)) {
			console.log(JSON.stringify(questionResponse));
			console.log("Questions response has error.");
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(questionResponse));
			callback();
        }
        else {
			console.log("Received questions response.");
            var questions = $.map(questionResponse['#data'], function(item){
                var question = new Question();
                question.id = item.nid;
                question.title = item.title;
                question.type = item.questiontype;
                question.options = item.questionoptions;
                for (var id in item.taxonomy) {
                    var questionTaxonomy = new QuestionTaxonomy();
                    questionTaxonomy.id = id;
                    questionTaxonomy.name = item.taxonomy[id].name;
                    question.taxonomy.push(questionTaxonomy);
                }
				console.log("Processed question with id: " + question.id);
                return question;
            });
            devtrac.localStore.put("questions", JSON.stringify(questions));
            devtrac.dataPull.updateStatus("Saved " + questions.length + " questions successfully.");
            console.log("Saved " + questions.length + " questions successfully.");
            devtrac.questions = questions;
            devtrac.dataPull.placeTypes(callback);
        }
    };
    
    var questionFailed = function(){
        console.log("Downloading of questions failed.");
        callback();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving questions from devtrac.");
    devtrac.remoteView.call('api_questions', 'page_1', '', questionSuccess, questionFailed);
}

DataPull.prototype.placeTypes = function(callback){
	console.log("Requesting places to download.");
    var placesSuccess = function(placesResponse){
		if (devtrac.common.hasError(placesResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(placesResponse));
            callback();
        }
        else {
			console.log("Received places response");
            var places = $.map(placesResponse['#data'], function(item){
                var placeType = new PlaceType();
                placeType.id = item.tid;
                placeType.name = item.term_data_name;
                placeType.parentId = item.term_data_term_hierarchy_tid ? item.term_data_term_hierarchy_tid : item.tid;
				console.log("Processed place with id: " + placeType.id);
                return placeType;
            });
            
			devtrac.localStore.put("placeTypes", JSON.stringify(places));
			
            devtrac.dataPull.updateStatus("Saved " + places.length + " place types successfully.");
            devtrac.places = places;
            devtrac.dataPull.userProfiles(callback);

            
        }
    };
    
    var placesFailed = function(){
        console.log("Error occured in places download.");
        callback();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving location types.");
    devtrac.remoteView.call('api_placetypes', 'page_1', '', placesSuccess, placesFailed);
}


DataPull.prototype.userProfiles = function(callback){
	console.log("Requesting user profiles download.");
    var profilesSuccess = function(profilesResponse){
        if (devtrac.common.hasError(profilesResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(profilesResponse));
            callback();
        }
        else {
			console.log("Received user profiles response.");
            var profiles = $.map(profilesResponse['#data'], function(item){
                var profile = new UserProfile();
                profile.nid = item.nid;
                profile.uid = item.uid;
                profile.name = item.title;
                profile.username = item.name;
				console.log("Processed user profile with id: " + profile.id);
                return profile;
            });
            
			devtrac.localStore.put( "profiles", JSON.stringify(profiles));
            devtrac.dataPull.updateStatus("Saved " + profiles.length + " user profiles successfully.");
            console.log("Saved " + profiles.length + " user profiles successfully.");
            devtrac.profiles = profiles;
            callback();
	
            
        }
    };
    
    var profilesFailed = function(){
		console.log("Error occured in downloading user profiles.");
        // Failed. Continue with callback function.
        callback();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving user profiles types.");
    devtrac.remoteView.call('api_users', 'page_1', '', profilesSuccess, profilesFailed);
}

DataPull.prototype.tripDetails = function(callback){
    $("#status").html("");
	console.log("Requesting trip details.");
    var tripSuccess = function(tripResponse){
        if (devtrac.common.hasError(tripResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(tripResponse));
            callback();
        }
        else {
			console.log("Received trip details response.");
            if (tripResponse["#data"].length > 0) {
                devtrac.dataPull.fieldTrip.id = tripResponse["#data"][0]["nid"];
                devtrac.dataPull.fieldTrip.title = tripResponse["#data"][0]["title"];
                devtrac.dataPull.tripSiteDetails(callback);
				console.log("Processed trip with id: " + devtrac.dataPull.fieldTrip.id);
                return;
            }
            alert("You don't have any active field trip. Please create a field trip.");
            devtrac.loginController.logout();
        }
    };
    
    var tripFailed = function(){
		console.log("Error occured in downloading trip details.");
        // Failed. Continue with callback function.
        callback()();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving field trip information.");
    devtrac.remoteView.call('api_fieldtrips', 'page_1', '["' + devtrac.user.uid + '"]', tripSuccess, tripFailed);
}

DataPull.prototype.tripSiteDetails = function(callback){
	console.log("Requesting trip site details.");
    var siteSuccess = function(siteResponse){
        if (devtrac.common.hasError(siteResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(siteResponse));
            callback();
        }
        else {
			console.log("Received trip site details response.");
            var sites = $.map(siteResponse['#data'], function(item){
                var site = new Site();
                site.id = item.nid;
                site.name = item.title;
                if (item.field_ftritem_place.length > 0 && item.field_ftritem_place[0].nid) {
                    site.placeId = item.field_ftritem_place[0].nid;
                }
                if (item.field_ftritem_narrative.length > 0 && item.field_ftritem_narrative[0].value) {
                    site.narrative = item.field_ftritem_narrative[0].value;
                }
				console.log("Processed site with id: " + site.id);
                devtrac.dataPull.sites.push(site);
                return site;
            });
            devtrac.dataPull.fieldTrip.sites = sites;
            if (sites.length == 0) {
                devtrac.dataPull.saveFieldtrip(callback);
                return;
            }
			console.log("Requesting details of place for sites.");
            devtrac.dataPull.placeDetailsForSite(callback);
        }
    };
    
    var siteFailed = function(){
		console.log("Error occured in downloading site details.");
        // Failed. Continue with callback function.
        callback();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving sites for '" + devtrac.dataPull.fieldTrip.title + "'.");
    
    devtrac.remoteView.call('api_fieldtrips', 'page_2', '["' + devtrac.dataPull.fieldTrip.id + '"]', siteSuccess, siteFailed);
}

DataPull.prototype.placeDetailsForSite = function(callback){
	if (devtrac.dataPull.sites.length == 0) {
       console.log("No sites to process. Resuming.");
		callback();
        return;
    }
    
    var site = devtrac.dataPull.sites.pop();
	console.log("Requesting place details for site: " + site.id);
    var placeSuccess = function(placeResponse){
        if (devtrac.common.hasError(placeResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(placeResponse));
            callback();
        }
        else {
			console.log("Received place details for site: " + site.id);
            if (placeResponse["#data"].length > 0) {
                var placeDetails = placeResponse["#data"][0];
                site.placeId = placeDetails.nid;
                site.placeName = placeDetails.title;
                site.placeGeo = placeDetails.field_place_lat_long.openlayers_wkt;
                site.contactInfo.name = placeDetails.field_place_responsible_person[0].value;
                site.contactInfo.phone = placeDetails.field_place_phone[0].value;
                site.contactInfo.email = placeDetails.field_place_email[0].email;
                site.placeTaxonomy = [];
                for (var index in placeDetails.taxonomy) {
                    var item = placeDetails.taxonomy[index];
                    var placeType = devtrac.dataPull.getPlaceTypeFor(item.tid);
                    if (placeType) {
                        var placeTaxonomy = new PlaceTaxonomy();
                        placeTaxonomy.id = item.tid;
                        placeTaxonomy.name = item.name;
                        site.type = placeType.name;
                        site.placeTaxonomy.push(placeTaxonomy);
                        break;
                    }
                }
            }
            
            $.each(devtrac.dataPull.fieldTrip.sites, function(index, siteFromCollection){
                if (siteFromCollection.id == site.id) {
                    devtrac.dataPull.fieldTrip.sites[index] = site;
                    devtrac.dataPull.sitesForActionItems.push(site);
                    if (devtrac.dataPull.sites.length > 0) {
						console.log("Requesting place details for next site.");
                        devtrac.dataPull.placeDetailsForSite(callback);
                    }
                    else {
						console.log("Retrieved place details for all sites. Moving on to action item details.");
                        devtrac.dataPull.actionItemDetailsForSite(callback);
                    }
                }
            });
        }
    };
    
    var placeFailed = function(){
		console.log("Error occured in downloading place details for site.");
        // Failed. Continue with callback function.
        callback();
    };
    console.log('showing pull status');
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving site details for '" + site.name + "'.");
    devtrac.remoteView.call('api_fieldtrips', 'page_4', '["' + site.id + '"]', placeSuccess, placeFailed);
}


DataPull.prototype.actionItemDetailsForSite = function(callback){
    if (devtrac.dataPull.sitesForActionItems.length == 0) {
		console.log.debug("No sites to process for action items. Resuming.");
        callback();
        return;
    }
    var site = devtrac.dataPull.sitesForActionItems.pop();
	console.log("Requesting action item details for site: " + site.id);
    var actionItemSuccess = function(actionItemResponse){
        if (devtrac.common.hasError(actionItemResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(actionItemResponse));
            callback();
        }
        else {
            var actionItems = $.map(actionItemResponse['#data'], function(item){
				var actionItem = new ActionItem();
                actionItem.title = item.title;
                actionItem.id = item.nid;
                actionItem.task = item.field_actionitem_followuptask[0].value;
                actionItem.assignedTo = $.map(item.field_actionitem_responsible, function(user){
                    return user.uid;
                }).join(", ");
				console.log("Processed action item: " + actionItem.title);
                return actionItem;
            });
            site.actionItems = actionItems;
            $.each(devtrac.dataPull.fieldTrip.sites, function(index, siteFromCollection){
                if (siteFromCollection.id == site.id) {
                    devtrac.dataPull.fieldTrip.sites[index] = site;
                    if (devtrac.dataPull.sitesForActionItems.length > 0) {
						console.log("More sites available. Continuing to fetch action items.");
                        devtrac.dataPull.actionItemDetailsForSite(callback);
                    }
                    else {
						console.log("Finished downloading action items. Saving fieldtrip.");
                        devtrac.dataPull.saveFieldtrip(callback);
                    }
                }
            });
        }
    };
    
    var actionItemFailed = function(){
		console.log("Error occured while downloading action items.");
        // Failed. Continue with callback function.
        callback();
    };
    
    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving action item details for '" + site.name + "'.");
    devtrac.remoteView.call('api_fieldtrips', 'page_5', '["' + site.id + '"]', actionItemSuccess, actionItemFailed);
}

DataPull.prototype.updateStatus = function(message){
    var status = $("#status");
    status.append(message);
    status.append("<br/>");
}

DataPull.prototype.getPlaceTypeFor = function(id){
    for (var index in devtrac.places) {
        var place = devtrac.places[index];
        if (id == place.id) {
            return place;
        }
    }
}

DataPull.prototype.saveFieldtrip = function(callback){
	devtrac.localStore.put(devtrac.user.name, JSON.stringify(devtrac.dataPull.fieldTrip));
	devtrac.dataPull.updateStatus("Saved '" + devtrac.dataPull.fieldTrip.title + "' with action items successfully.");
    setTimeout(function(){
        callback();
    }, 1000);
}

var QuestionTypes = function(questions){
    this.questions = questions;
    var that = this;
    
    this.locationTypes = function(){
        var types = $.map(that.questions, function(q){
            return q.taxonomy[0].name;
        });
        return $.unique(types);
    }
}
