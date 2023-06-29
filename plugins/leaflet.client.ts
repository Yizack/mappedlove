import { OpenStreetMapProvider } from "leaflet-geosearch";
import * as L from "leaflet";

interface MarkerOptions extends L.MarkerOptions {
  id: number
}

interface AddMarkerOptions {
  position: [number, number],
  popup: string,
  options: MarkerOptions,
  group: string,
}

class Leaflet {
  searchProvider: OpenStreetMapProvider;
  map: L.Map | null;
  markers: { [key: string]: L.Marker[] };
  tile: L.TileLayer;
  icon: L.Icon;

  constructor (email: string) {
    this.searchProvider = new OpenStreetMapProvider({ params: { email } });
    this.map = null;
    this.markers = {};
    this.tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    });
    this.icon = L.icon({
      iconUrl: "/images/map/marker-icon-heart.png",
      shadowUrl: "/images/map/marker-shadow.png",
      iconSize: [25, 32],
      shadowSize: [41, 41],
      iconAnchor: [12.5, 31],
      shadowAnchor: [12, 40],
      popupAnchor: [1, -28]
    });
  }

  createMap (id: string | HTMLElement) {
    const groups = this.getGroups();
    this.map = L.map(id, {
      center: [0, 0],
      zoom: 3,
      minZoom: 2,
      layers: [this.tile, ...Object.values(groups)]
    });
    L.control.layers(undefined, groups).addTo(this.map);
    return this.map;
  }

  addMarker ({ position, popup, options, group }: AddMarkerOptions) {
    options.icon = this.icon;
    const marker = L.marker([...position], options).bindPopup(popup);
    if (!this.markers[group]) {
      this.markers[group] = [];
    }
    this.markers[group].push(marker);
    return marker;
  }

  getGroups () {
    return {
      ...Object.entries(this.markers).reduce((groups, [group, arr]) => {
        groups[group] = L.layerGroup(arr);
        return groups;
      }, {} as { [key: string]: L.LayerGroup })
    };
  }

  setView (position: [number, number], zoom: number) {
    if (this.map === null) {
      return;
    }
    this.map.setView([...position], zoom);
  }

  getMarker (id: number) {
    return Object.values(this.markers).flat().find(marker => (marker.options as MarkerOptions).id === id);
  }

  async geoSearch (query: string) {
    return await this.searchProvider.search({ query }).catch(() => []);
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: { Leaflet }
  };
});
