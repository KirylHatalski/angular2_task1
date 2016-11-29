import './styles.styl'
import loadGoogleMapsAPI from 'load-google-maps-api';

let geoLat: number,
    geoLng: number,
    map: Object,
    weather: Object;

navigator.geolocation.getCurrentPosition(
    function(position: any) {
        geoLat = position.coords.latitude;
        geoLng = position.coords.longitude;

        initMap();
    },
    function() {
        console.log('Something going wrong');
        geoLat = getRandom(180);
        geoLng = getRandom(360);

        initMap();
    });

function initWeather() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        if (localStorage.getItem('weather')) {
            weather = JSON.parse(localStorage.getItem('weather'));
            if (Date.now() - weather.createTime < 10 * 60 * 1000) resolve(weather);
        }

        if (!weather || (Date.now() - weather.createTime > 10 * 60 * 1000)) {
            xhr.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${geoLat}&lon=${geoLng}&cnt=50&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26`, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    weather = JSON.parse(xhr.responseText);
                    weather.createTime = Date.now();

                    localStorage.setItem('weather', JSON.stringify(weather));
                    resolve(weather);
                }
            }
        }
    });
}

function CreateMark(data) {
    data.list.forEach(variable => {
        new google.maps.Marker({
            position: { lat: +variable.coord.lat, lng: +variable.coord.lon },
            map: map,
            icon: {
                url: `http://openweathermap.org/img/w/${variable.weather[0].icon}.png`,
                size: new google.maps.Size(50, 100)
            },
            label: {
                text: `${Math.round(variable.main.temp - 273.15)} °C`,
                color: "rgb(254, 171, 46)",
                fontSize: '18px'
            },
            title: variable.name
        });
    });
}

function initMap() {
    loadGoogleMapsAPI(['AIzaSyA2BbPGgt4MP4YD12z5AftgBgGS9vitNJE']).then((googleMaps: any) => {
        map = new googleMaps.Map(document.querySelector('.map'), {
            center: { lat: geoLat, lng: geoLng },
            zoom: 10,
            mapTypeId: googleMaps.MapTypeId.SATELLITE
        });

        initWeather().then((data) => CreateMark.call(this, data));
    }).catch((err: any) => {
        console.log(err)
    });
}

function getRandom(range: number) {
    return (Math.random() * range) - (range / 2);
}
