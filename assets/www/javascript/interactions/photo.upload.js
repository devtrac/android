function PhotoUpload(){
}

PhotoUpload.prototype.upload = function(filePath, successCallback, errorCallback){
    var photoReader = new PhotoReader();
    photoReader.readFile(filePath, function(imageData) {
        devtrac.photoUpload.uploadImage(imageData, successCallback, errorCallback);
    }, errorCallback);
}

PhotoUpload.prototype.uploadImage = function(imageData, successCallback, errorCallback){
    var sessionId = devtrac.user.session.id;
    var userId = devtrac.user.uid;
    var timestamp = Math.round(new Date().getTime() / 1000);
    var fileUploadPath = DT.FILE_UPLOAD_PATH.replace('<UID>', userId)

    var imageData = 'abc';

    var file = {
        uid: userId,
        timestamp: timestamp,
        filemime: 'image/png',
        file: encodeURI(imageData)
    };

    var params = {
        method: DT.FILE_SAVE,
        sessid: sessionId,
        domain_name: DT.DOMAIN,
        domain_time_stamp: timestamp,
        api_key: DT.API_KEY,
        nonce: timestamp,
        hash: devtrac.common.generateHash(DT.FILE_SAVE, timestamp),
        file: JSON.stringify(file)
    }
    devtrac.common.callService(params, function(response){
	        successCallback(response["#data"]);
	    }, errorCallback);
}

PhotoUpload.prototype.uploadMultiple = function(filePaths, successCallback, progressCallback, errorCallback){
	devtrac.photoUpload._uploadInternal(filePaths, {}, successCallback, progressCallback, errorCallback);
}

PhotoUpload.prototype._uploadInternal = function(filePaths, uploadedFiles, successCallback, progressCallback, errorCallback){
	var fileToUpload = filePaths.pop();
	if(fileToUpload){
		devtrac.photoUpload.upload(fileToUpload,function(fid){
			uploadedFiles[fileToUpload] = fid;
			if(progressCallback)
				progressCallback(uploadedFiles,fileToUpload, fid);
			devtrac.photoUpload._uploadInternal(filePaths, uploadedFiles, successCallback, progressCallback, errorCallback);
		}, errorCallback);
	} else {
		successCallback(uploadedFiles);
	}
}