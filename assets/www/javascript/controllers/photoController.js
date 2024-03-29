function PhotoController(){
    var imagePath;
}

PhotoController.prototype.show = function(){
	console.log("Showing photo list.");
    var container = $("#photo_list");
    container.html("");
    for (var path in devtrac.currentSite.photos) {
        container.append("<li><img class='thumbnail' src='" + path + "'/></li>");
    }
	console.log("Displayed photo screen.");
    screens.show("photo");
}

PhotoController.prototype.attach = function(){
    console.log("Attaching photo.");
    if (imagePath) {
            devtrac.currentSite.photos[imagePath] = "";
            devtrac.currentSite.uploaded = false;
            devtrac.dataStore.saveCurrentSite(function(){
                alert("Image attached successfully.");
                devtrac.photoController.show();
           })
		console.log("Attached photo: " + imagePath);
    }
}

function choosePhoto(){
    navigator.camera.getPicture(function(imageURI){
        imagePath = imageURI;
    },function(){
        alert('Failed on choosing photo.');
    },{sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
}
