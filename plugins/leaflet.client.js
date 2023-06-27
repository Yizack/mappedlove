import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

class Leaflet {
  constructor (email) {
    this.searchProvider = new OpenStreetMapProvider({ params: { email } });
    this.map = null;
    this.markers = {};
    this.tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    });
  }

  createMap (id) {
    const groups = this.getGroups();
    this.map = L.map(id, {
      center: [0, 0],
      zoom: 3,
      layers: [this.tile, ...Object.values(groups)]
    });
    L.control.layers(null, groups).addTo(this.map);
  }

  addMarker ({ position, popup, options, group }) {
    if (options?.icon) {
      options.icon = L.icon(options.icon);
    }
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
      }, {})
    };
  }

  async geoSearch (query) {
    return await this.searchProvider.search({ query }).catch(() => []);
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: { Leaflet }
  };
});
