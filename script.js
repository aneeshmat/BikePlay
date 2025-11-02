function sendData(lat, lon, speed, heading) {
  fetch("http://172.16.48.155:5000/navdata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: lat, longitude: lon, speed: speed, heading: heading })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").textContent = "Data sent!";
  })
  .catch(err => {
    document.getElementById("status").textContent = "Error sending data.";
    console.error(err);
  });
}

function startTracking() {
  if (!navigator.geolocation) {
    document.getElementById("status").textContent = "Geolocation not supported.";
    return;
  }

  document.getElementById("status").textContent = "Tracking started...";

  navigator.geolocation.watchPosition(function(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const speed = position.coords.speed || 0;
    const heading = position.coords.heading || 0;

    sendData(lat, lon, speed, heading);
  }, function(error) {
    document.getElementById("status").textContent = "Location error: " + error.message;
  }, {
    enableHighAccuracy: true,
    maximumAge: 1000
  });
}