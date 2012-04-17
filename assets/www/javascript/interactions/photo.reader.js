function PhotoReader(){
    var _successCallback = function(){};
    var _errorCallback = function(){};

    this.readFile = function(filePath, successCallback, errorCallback){
        _successCallback = successCallback;
        _errorCallback = errorCallback;
        window.resolveLocalFileSystemURI(filePath, this.onResolveSuccess, this.errorCallback);
    }

    this.onResolveSuccess = function(fileEntry) {
        var that = this;
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                _successCallback(file.name, file.type, evt.target.result.substring(evt.target.result.indexOf(",") + 1));
            };
            reader.readAsDataURL(file);
        }, function(error){
            var errorMsg = "Read image data failed. Error code: " + error.code;
            alert(errorMsg);
            _errorCallback(errorMsg);
        });
    }
}
