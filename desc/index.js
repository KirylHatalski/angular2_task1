/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(2);
	var geoLat, geoLng, map, weather;
	navigator.geolocation.getCurrentPosition(function (position) {
	    geoLat = position.coords.latitude;
	    geoLng = position.coords.longitude;
	    initMap();
	}, function () {
	    console.log('Something going wrong');
	    geoLat = getRandom(180);
	    geoLng = getRandom(360);
	    initMap();
	});
	function initWeather() {
	    return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        if (localStorage.getItem('weather')) {
	            weather = JSON.parse(localStorage.getItem('weather'));
	            if (Date.now() - weather.createTime < 10 * 60 * 1000)
	                resolve(weather);
	        }
	        if (!weather || (Date.now() - weather.createTime > 10 * 60 * 1000)) {
	            xhr.open('GET', "http://api.openweathermap.org/data/2.5/find?lat=" + geoLat + "&lon=" + geoLng + "&cnt=50&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26", true);
	            xhr.send();
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4 && xhr.status == 200) {
	                    weather = JSON.parse(xhr.responseText);
	                    weather.createTime = Date.now();
	                    localStorage.setItem('weather', JSON.stringify(weather));
	                    resolve(weather);
	                }
	            };
	        }
	    });
	}
	function CreateMark(data) {
	    data.list.forEach(function (variable) {
	        new google.maps.Marker({
	            position: { lat: +variable.coord.lat, lng: +variable.coord.lon },
	            map: map,
	            icon: {
	                url: "http://openweathermap.org/img/w/" + variable.weather[0].icon + ".png",
	                size: new google.maps.Size(50, 100)
	            },
	            label: {
	                text: Math.round(variable.main.temp - 273.15) + " \u00B0C",
	                color: "rgb(254, 171, 46)",
	                fontSize: '18px'
	            },
	            title: variable.name
	        });
	    });
	}
	function initMap() {
	    var _this = this;
	    var elem = document.createElement('script');
	    window.googleResponse = function () {
	        map = new google.maps.Map(document.querySelector('.map'), {
	            center: { lat: geoLat, lng: geoLng },
	            zoom: 10,
	            mapTypeId: google.maps.MapTypeId.SATELLITE
	        });
	        initWeather().then(function (data) { return CreateMark.call(_this, data); });
	    };
	    elem.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2BbPGgt4MP4YD12z5AftgBgGS9vitNJE&callback=googleResponse";
	    document.body.appendChild(elem);
	}
	function getRandom(range) {
	    return (Math.random() * range) - (range / 2);
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */
/***/ function(module, exports) {

	

/***/ }
/******/ ]);