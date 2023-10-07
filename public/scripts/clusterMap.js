const map = L.map("cluster-map").setView([55.0, -3.436], 6);
console.log(gyms);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

const markers = L.markerClusterGroup();

for (let gym of gyms) {
  console.log(gym);
  const [latitude, longitude] = gym.geometry.coordinates;
  const title = gym.name;
  const marker = L.marker(new L.LatLng(longitude, latitude), {
    title: title,
  });
  marker.bindPopup().setPopupContent(`<a href="/gyms/${gym._id}">${gym.name}</a>`);
  markers.addLayer(marker);
}

map.addLayer(markers);
