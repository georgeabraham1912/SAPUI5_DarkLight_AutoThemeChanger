sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	
	return Controller.extend("com.george.project.DarkLight.controller.Home", {
		onInit: function () {
			//Dummy model for screen binding
			var oModel = new JSONModel({
				aShipments: [{
					code: "HT-4785",
					origin: "Brussels",
					destination: "Walldorf",
					status: "Shipped"
				}, {
					code: "HT-9585",
					origin: "Amsterdam",
					destination: "Paris",
					status: "Missing"
				}, {
					code: "HT-3278",
					origin: "Moscow",
					destination: "Peru",
					status: "Damaged"
				}, {
					code: "HT-6659",
					origin: "Sydney",
					destination: "Stockholm",
					status: "Preparing"
				}]
			});

			this.getView().setModel(oModel, "shipmentModel");
		},

		onAfterRendering: function () {
			function fnChangeTheme() {
				//Get the current position and pass it to fnGetSunset() if GeoLocation is supported
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(fnGetSunset);
				} else {
					alert("Geolocation is not supported by this browser.");
				}
			}

			function fnGetSunset(position) {
				console.log(position);

				var lat = position.coords.latitude;
				var long = position.coords.longitude;

				$.getJSON('https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + long + '&formatted=0&callback=?', function (data) {
					console.log(data);

					var currentHrs = new Date().getHours();
					console.log("CurrentHrs: " + currentHrs);
					var sunsetHrs = new Date(data.results.sunset).getHours();
					console.log("Sunset:" + sunsetHrs);
					
					//if Current Hrs is <= Sunset Hrs, then light theme else dark theme
					if (currentHrs <= sunsetHrs) {
						sap.ui.getCore().applyTheme("sap_fiori_3");
					} else {
						sap.ui.getCore().applyTheme("sap_fiori_3_dark");
					};
				});
			}
			
			//call fnChangeTheme for initial Theme setting
			fnChangeTheme();

			//Check every minute for location/sunset change
			setInterval(function () {
				fnChangeTheme()
			}, 60000);
		}
	});
});