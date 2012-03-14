
function authenticate(userName, password, successCallback, failedCallback){

    var connectCallback = function(data){
		console.log(JSON.stringify(data));
        var sessionId = data[DT.DATA_REF][DT.SESSION_ID_REF];
        if (userLoggedIn(data)) {
			console.log("User has logged in.'");
            successCallback(data);
        }
        else {
            var timestamp = Math.round(new Date().getTime() / 1000);
            var params = {
                method: DT.USER_LOGIN,
                sessid: sessionId,
                username: userName,
                password: password,
                domain_name: DT.DOMAIN,
                domain_time_stamp: timestamp,
                api_key: DT.API_KEY,
                nonce: timestamp,
                hash: devtrac.common.generateHash(DT.USER_LOGIN, timestamp)
            };
			
            devtrac.common.XHR(params, successCallback, failedCallback);
        }
    };
    devtrac.common.XHR({method: DT.SYSTEM_CONNECT}, connectCallback, failedCallback);
    
}

function logout(successCallback, failedCallback){
    var sessionId = devtrac.user.session.id;
    
    var timestamp = Math.round(new Date().getTime() / 1000);
    var params = {
        method: DT.USER_LOGOUT,
        sessid: sessionId,
        domain_name: DT.DOMAIN,
        domain_time_stamp: timestamp,
        api_key: DT.API_KEY,
        nonce: timestamp,
        hash: devtrac.common.generateHash(DT.USER_LOGIN, timestamp)
    };
    devtrac.common.callService(params, successCallback, failedCallback);
}

function userLoggedIn(response){
    return response[DT.DATA_REF] && response[DT.DATA_REF][DT.USER_REF] &&
    response[DT.DATA_REF][DT.USER_REF][DT.NAME_REF] &&
    response[DT.DATA_REF][DT.USER_REF][DT.PASSWORD_REF];
}

