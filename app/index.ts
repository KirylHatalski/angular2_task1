import './styles.styl'
import './interfaces.ts'

let geoLat: number,
    geoLng: number,
    map: google.maps.Map,
    weather: IWeather;

navigator.geolocation.getCurrentPosition(
    function(position: IPositionNavigator) {
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

function initWeather(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
        let xhr = new XMLHttpRequest();

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

function CreateMark(data: IMarkData) {
    data.list.forEach((variable: IDataListItem) => {
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
    let elem = document.createElement('script');
        (<IWindow>window).googleResponse = () => {
          map = new google.maps.Map(document.querySelector('.map'), {
              center: { lat: geoLat, lng: geoLng },
              zoom: 10,
              mapTypeId: google.maps.MapTypeId.SATELLITE
          });

          initWeather().then((data: Object) => CreateMark.call(this, data));
        }

        elem.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA2BbPGgt4MP4YD12z5AftgBgGS9vitNJE&callback=googleResponse`

        document.body.appendChild(elem);
}

function getRandom(range: number) {
    return (Math.random() * range) - (range / 2);
}
