var devtrac = {
    loginController: new LoginController(),
    user: new User(),
    common: new Common(),
    fieldTrip: new FieldTrip(),
    dataPull: new DataPull(),
    dataPush: new DataPush(),
    dataStore: new DataStore(),
    siteDetailController: new SiteDetailController(),
    questionsController: new QuestionsController(),
    contactInfoController: new ContactInfoController(),
    actionItemController: new ActionItemController(),
    settingsController: new SettingsController(),
    photoController: new PhotoController(),
    remoteView: new RemoteView(),
    photoUpload: new PhotoUpload(),
    siteUpload: new SiteUpload(),
    currentSite: "",
    places: "",
    questions: "",
    profiles: ""
}

function onLoad(){
    /*
   document.addEventListener("deviceready", function(){
        navigator.notification.alert("Hello world from PhoneGap");
   }, true);
   */
   init();
}

function init(){
	//navigator.notification.alert("Hello world from PhoneGap");
    initializeApplicationEvents();
    //devtrac.dataStore.init(fieldTripController.showTripReports);
}
