var siteController = new Object();

siteController.add = function(){
    console.log("Adding site.");
	var questions = new QuestionTypes(devtrac.questions);
	var list = $('#sitetypes');
	list.html("");
    $(questions.locationTypes()).each(function(i, option){
        list.append("<option>" + option + "</option>");
    });
    screens.show("add_new_site");
	console.log("Displayed add new site screen.");
};

siteController.list = function(){
	console.log("Displayed list of field trips.");
    screens.show("sites_to_visit");
};

siteController.create = function(){
	console.log("Creating a new site");
    var site = new Site();
    site.id = Math.round(new Date().getTime() / 1000);
    site.offline = true;
    site.name = $("#site_title").val();
    site.type = $("#sitetypes").val();
    site.narrative = "Please provide a full report.";
	devtrac.fieldTrip.sites.push(site);

    devtrac.localStore.put(devtrac.user.name, JSON.stringify(devtrac.fieldTrip));
    alert(site.name + " added successfuly.");
    $("#site_title").val("");
    console.log("Saved newly created site.");
    fieldTripController.showTripReports();
}

