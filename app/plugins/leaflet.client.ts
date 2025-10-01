import { Browser, Control, DomUtil, Icon, LayerGroup, Map, Marker, type MarkerOptions, Popup, TileLayer } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import type { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";

// @ts-expect-error - no types
Popup.prototype._animateZoom = function (e) {
  if (!this.isOpen()) return; // @ts-expect-error - no types
  const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), anchor = this._getAnchor(); // @ts-expect-error - no types
  DomUtil.setPosition(this._container, pos.add(anchor));
};

interface PluginMarkerOptions extends MarkerOptions {
  id: number;
}

interface AddMarkerOptions {
  position: [number, number];
  popup: string;
  options: PluginMarkerOptions;
  group: string;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

class Leaflet {
  map: Map | null;
  markers: Record<string, Marker[]>;
  tile: TileLayer;
  icon: Icon;
  groups: Record<string, LayerGroup>;

  constructor () {
    this.map = null;
    this.markers = {};
    this.tile = new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    });

    this.icon = new Icon({
      iconUrl: isDarkMode() ? "/images/map/marker-icon-heart-dark.png" : "/images/map/marker-icon-heart.png",
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
    this.map = new Map(element, {
      center: [0, 0],
      zoom: 3,
      minZoom: Browser.mobile ? 2 : 3,
      zoomControl: false,
      maxBounds: [[-90, -Infinity], [90, Infinity]],
      maxBoundsViscosity: 1,
      layers: [this.tile, ...Object.values(this.groups)]
    });

    new Control.Zoom({ position: "bottomright" }).addTo(this.map);
    new Control.Layers(undefined, this.groups, { position: "bottomleft" }).addTo(this.map);

    this.map.attributionControl.setPrefix("<a target=\"_blank\" href=\"https://leafletjs.com\" title=\"A JavaScript library for interactive maps\">Leaflet</a>");
    return this.map;
  }

  createGroups (group: string[]) {
    for (const key of group) {
      this.groups[key] = new LayerGroup();
    }
  }

  destroyMap () {
    if (this.map === null) return;
    this.map.remove();
    this.map = null;
  }

  addMarker ({ position, popup, options, group }: AddMarkerOptions) {
    options.icon = this.icon;
    const marker = new Marker([...position], options).bindPopup(popup, { autoPan: false });
    if (!this.markers[group]) {
      this.markers[group] = [];
    }
    this.markers[group]!.push(marker);
    marker.addTo(this.groups[group]!);
    return marker;
  }

  removeMarker (id: number) {
    const marker = this.getMarker(id);
    if (marker) marker.remove();
  }

  setView (position: [number, number], zoom?: number) {
    this.map?.setView([...position], zoom);
  }

  getMarker (id: number) {
    return Object.values(this.markers).flat().find(marker => (marker.options as PluginMarkerOptions).id === id);
  }

  closeAllPopups () {
    Object.values(this.markers).flat().forEach(marker => marker.closePopup());
  }

  setMarkersDragging (draggable: boolean) {
    for (const marker of Object.values(this.markers).flat()) {
      if (draggable) marker.dragging?.enable();
      else marker.dragging?.disable();
    }
  }

  static async geoSearch (query: string, options: { email: string, lang: string }) {
    const results = await new OpenStreetMapProvider({
      params: {
        "email": options.email,
        "accept-language": options.lang,
        "addressdetails": 1
      }
    }).search({ query }).catch(() => []) as SearchResult<RawResult & { address?: NominatimAddress }>[];
    return results;
  }
}

declare module "#app" {
  interface NuxtApp {
    $Leaflet: typeof Leaflet;
  }
}

export default defineNuxtPlugin({
  parallel: true,
  async setup () {
    return {
      provide: { Leaflet }
    };
  }
});
