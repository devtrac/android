function SiteDetailController(){

}

SiteDetailController.prototype.show = function(){
	console.log("Showing details for site.");
    var name = devtrac.currentSite.name;
    if (name.length > 27){
        name = name.substring(0,24) + '...';
    }
    $("#site_details_title").html(name);
    screens.show('site_details');
};

SiteDetailController.prototype.narrative = function(){
	console.log("Showing narrative of site.");
    $(".site_narrative_notes").val(devtrac.currentSite.narrative);
    screens.show('site_narrative');
};

SiteDetailController.prototype.updateNarrative = function(){
	var narrative = $(".site_narrative_notes").val();
	if (narrative) {
		devtrac.currentSite.narrative = narrative;

		devtrac.currentSite.uploaded = false;
		devtrac.dataStore.saveCurrentSite(function(){
			alert("Updated narrative text.");
			devtrac.siteDetailController.show();
		});
	}else{
		alert("Please provide summary.");
	}
};
