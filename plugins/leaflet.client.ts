import { OpenStreetMapProvider } from "leaflet-geosearch";
import * as L from "leaflet";

// @ts-expect-error
L.Popup.prototype._animateZoom = function (e) { // @ts-expect-error
  if (!this._map) return; // @ts-expect-error
  const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), anchor = this._getAnchor(); // @ts-expect-error
  L.DomUtil.setPosition(this._container, pos.add(anchor));
};

interface MarkerOptions extends L.MarkerOptions {
  id: number
}

interface AddMarkerOptions {
  position: [number, number],
  popup: string,
  options: MarkerOptions,
  group: string
}

class Leaflet {
  map: L.Map | null;
  markers: Record<string, L.Marker[]>;
  tile: L.TileLayer;
  icon: L.Icon;
  groups: Record<string, L.LayerGroup>;

  constructor () {
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
    this.groups = {};
  }

  createMap (element: string | HTMLElement) {
    this.map = L.map(element, {
      center: [0, 0],
      zoom: 3,
      minZoom: 2,
      zoomControl: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      layers: [this.tile, ...Object.values(this.groups)]
    });
    L.control.layers(undefined, this.groups).addTo(this.map);
    return this.map;
  }

  createGroups (group: string[]) {
    for (const key of group) {
      this.groups[key] = L.layerGroup();
    }
  }

  destroyMap () {
    if (this.map === null) return;
    this.map.remove();
    this.map = null;
  }

  addMarker ({ position, popup, options, group }: AddMarkerOptions) {
    options.icon = this.icon;
    const marker = L.marker([...position], options).bindPopup(popup);
    if (!this.markers[group]) {
      this.markers[group] = [];
    }
    this.markers[group].push(marker);
    marker.addTo(this.groups[group]);
    return marker;
  }

  removeMarker (id: number) {
    const marker = this.getMarker(id);
    if (marker) marker.remove();
  }

  setView (position: [number, number], zoom: number) {
    if (this.map === null) return;
    this.map.setView([...position], zoom);
  }

  getMarker (id: number) {
    return Object.values(this.markers).flat().find(marker => (marker.options as MarkerOptions).id === id);
  }

  static async geoSearch (query: string, options?: { email: string, lang: string }) {
    const params = options ? {
      email: options.email,
      "accept-language": options.lang
    } : undefined;
    return await new OpenStreetMapProvider({ params }).search({ query }).catch(() => []);
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: { Leaflet }
  };
});
