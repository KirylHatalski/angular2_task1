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
	var load_google_maps_api_1 = __webpack_require__(2);
	var geoLat, geoLng, map, weather;
	//
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
	                else {
	                    reject(Error('There was a network error.'));
	                }
	            };
	        }
	    });
	}
	function CreateMark(data) {
	    console.log(data);
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
	    load_google_maps_api_1.default(['AIzaSyA2BbPGgt4MP4YD12z5AftgBgGS9vitNJE']).then(function (googleMaps) {
	        map = new googleMaps.Map(document.querySelector('.map'), {
	            center: { lat: geoLat, lng: geoLng },
	            zoom: 10,
	            mapTypeId: googleMaps.MapTypeId.SATELLITE
	        });
	        initWeather().then(function (data) { return CreateMark.call(_this, data); });
	    }).catch(function (err) {
	        console.log(err);
	    });
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var client = _ref.client;
	  var key = _ref.key;
	  var language = _ref.language;
	  var _ref$libraries = _ref.libraries;
	  var libraries = _ref$libraries === undefined ? [] : _ref$libraries;
	  var _ref$timeout = _ref.timeout;
	  var timeout = _ref$timeout === undefined ? 10000 : _ref$timeout;
	  var v = _ref.v;

	  var callbackName = '__googleMapsApiOnLoadCallback';

	  return new Promise(function (resolve, reject) {

	    // Exit if not running inside a browser.
	    if (typeof window === 'undefined') {
	      return reject(new Error('Can only load the Google Maps API in the browser'));
	    }

	    // Prepare the `script` tag to be inserted into the page.
	    var scriptElement = document.createElement('script');
	    var params = ['callback=' + callbackName];
	    if (client) params.push('client=' + client);
	    if (key) params.push('key=' + key);
	    if (language) params.push('language=' + language);
	    libraries = [].concat(libraries); // Ensure that `libraries` is an array
	    if (libraries.length) params.push('libraries=' + libraries.join(','));
	    if (v) params.push('v=' + v);
	    scriptElement.src = 'https://maps.googleapis.com/maps/api/js?' + params.join('&');

	    // Timeout if necessary.
	    var timeoutId = null;
	    if (timeout) {
	      timeoutId = setTimeout(function () {
	        window[callbackName] = function () {}; // Set the on load callback to a no-op.
	        reject(new Error('Could not load the Google Maps API'));
	      }, timeout);
	    }

	    // Hook up the on load callback.
	    window[callbackName] = function () {
	      if (timeoutId !== null) {
	        clearTimeout(timeoutId);
	      }
	      resolve(window.google.maps);
	      delete window[callbackName];
	    };

	    // Insert the `script` tag.
	    document.body.appendChild(scriptElement);
	  });
	};

/***/ }
/******/ ]);