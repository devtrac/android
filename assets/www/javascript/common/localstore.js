function LocalStore(){
}

LocalStore.prototype.put= function(key, value){
	window.localStorage.setItem(key, value);
}

LocalStore.prototype.get= function(key){
    return window.localStorage.getItem(key);	
}

LocalStore.prototype.remove= function(key){
	window.localStorage.removeItem(key);
}
