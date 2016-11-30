
interface ICoordinates {
  latitude: number;
  longitude: number;
}

interface IPositionNavigator {
  coords: ICoordinates;
}

interface IGooAPI {
  google: IMapsObj;
}

interface INewGooAPI {
  new(): IGooAPI;
}

interface IMapsObj {
  maps: IMapsMethods;
}

interface IMapsMethods {
  Map: Function;
  MapTypeId: IMapTypeId;
  Size: Function;
  Marker: Function;
}

interface IMapTypeId {
  SATELLITE: string;
}

interface IWindow extends Window {
  googleResponse: Function;
}

interface IMarkData {
  list: Array<IDataListItem>;
}

interface IDataListItem {
  coord: IAnotherCoords;
  weather: Array<IIcons>;
  main: ITemperatyre;
  name: string;
}

interface IIcons {
  icon: string;
}

interface IAnotherCoords {
  lat: number;
  lon: number;
}

interface ITemperatyre {
  temp: number;
}

interface IMarkSize {

}

interface IWeather {
  createTime: number;
}
