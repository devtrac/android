function Common(){
    this.callService = function(data, callback, errorCallback){
        this.XHR(data, callback, errorCallback);
    }

    this.convertHash = function(hash){
        var paramStr = "";
        for (param in hash) {
            paramStr += param;
            paramStr += '=';
            paramStr += hash[param];
            paramStr += "&";
        }
        return paramStr;
    }

    this.XHR = function(data, successCallback, errorCallback){
        try{
            console.log('post data: ' + JSON.stringify(data));
            var request = $.ajax({
            url: DT.SERVICE_ENDPOINT,
            type: 'post',
            data: devtrac.common.convertHash(data),
            dataType: 'json',
            timeout: 180000,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                errorCallback('Request failed, since '+ textStatus);
            },
            success: function (data) {
                successCallback(data);
            }
        });
        }
        catch(error){
             alert("XHR error - " + error);
        }
    }

    this.generateHash = function(method, timestamp){
        return Crypto.HMAC(Crypto.SHA256, timestamp + ";" + DT.DOMAIN + ";" + timestamp + ";" + method, DT.API_KEY)
    }

    this.newHasError = function(response){
        return false;
    }

    this.hasError = function(response){
        if (response["#error"]) {
            return true;
        }
        else {
            if (response["#data"]) {
                var data = response["#data"];
                if (data["#error"]) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    }

    this.getErrorMessage = function(response){
        if (response["#error"]) {
            if (response["#message"]) {
                return response["#message"];
            }
            else {
                if (response["#data"]) {
                    return response["#data"];
                }
                else {
                    return "Unknown error occured. Please try again.";
                }
            }
        }
        else {
            if (response["#data"]) {
                var data = response["#data"];
                if (data["#error"]) {
                    return data["#message"];
                }
                else {
                    return "Unknown error.";
                }
            }
            else {
                return "Unexpected #data format.";
            }
        }
    }

    this.getOneMonthLaterDate = function(){
        var now = new Date();
        var oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        var day = (oneMonthLater.getDate() < 9) ? '0' + oneMonthLater.getDate() : '' + oneMonthLater.getDate();
        var month = (oneMonthLater.getMonth() < 9) ? '0' + oneMonthLater.getMonth() : '' + oneMonthLater.getMonth();
        var year = '' + oneMonthLater.getFullYear();
        return day + '/' + month + '/' + year;
    }

    this.errorHandler = function(errMsg, url, lineNum){
        alert(errMsg);
        var errorMessage = 'UnCaughtException: ' + errMsg;
        if (url)
            errorMessage += ' for page: ' + url;
        if (lineNum)
            errorMessage += ' on Line# ' + lineNum;
        alert(errorMessage);
        navigator.log.log(errorMessage);
        return false;
    }

    this.logAndShowGenericError = function(message){
        console.log(message);
        alert("Error occured while processing. Refer to log console for more details.");
    }

    this.validateAssignedTo = function(assignedValue){
        for (var index in devtrac.profiles) {
            var profile = devtrac.profiles[index];
            if (profile.uid === assignedValue || profile.username === assignedValue) {
                return profile.username;
            }
        }
        return devtrac.user.name;
    }

    this.findPlaceType = function(site){
        if (site.offline) {
            for (var index in devtrac.places) {
                var place = devtrac.places[index];
                if (site.type == place.name) {
                    return place.id;
                }
            }
        }
        return site.placeTaxonomy && site.placeTaxonomy.length > 0 && site.placeTaxonomy[0] && site.placeTaxonomy[0].id;
    }
}
