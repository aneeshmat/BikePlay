const endpoint = "/navdata"; // same-origin, avoids CORS
let watchId = null;
let lastSent = 0;
const SEND_INTERVAL_MS = 1000; // throttle to 1 Hz to reduce load

function log(msg) {
  const el = document.getElementById("log");
  const ts = new Date().toLocaleTimeString();
  el.textContent = `[${ts}] ${msg}\n` + el.textContent;
}

async function sendData(payload) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // keepalive helps if the page is being closed; optional
      keepalive: true
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    document.getElementById("status").textContent = "Data sent!";
  } catch (err) {
    document.getElementById("status").textContent = "Error sending data.";
    console.error(err);
    log(`Send error: ${err.message}`);
  }
}

function startTracking() {
  if (!navigator.geolocation) {
    document.getElementById("status").textContent = "Geolocation not supported.";
    return;
  }

  document.getElementById("status").textContent = "Tracking started...";

  // On iOS Safari, this must be called in response to a user gesture, which we do via the button click
  watchId = navigator.geolocation.watchPosition(
    position => {
      const now = Date.now();
      if (now - lastSent < SEND_INTERVAL_MS) return;
      lastSent = now;

      const {
        latitude: lat,
        longitude: lon,
        altitude,
        accuracy,
        altitudeAccuracy,
        heading,
        speed
      } = position.coords;

      const payload = {
        latitude: lat,
        longitude: lon,
        speed: speed ?? 0,       // speed is m/s per spec
        heading: heading ?? 0,   // null when stationary or low speed
        accuracy,                // meters
        altitude: altitude ?? null,
        altitudeAccuracy: altitudeAccuracy ?? null,
        timestamp: position.timestamp
      };

      log(`lat=${lat.toFixed(6)}, lon=${lon.toFixed(6)}, spd=${(payload.speed||0).toFixed(2)} m/s, hdg=${payload.heading}`);
      sendData(payload);
    },
    error => {
      document.getElementById("status").textContent = "Location error: " + error.message;
      log("Geolocation error: " + error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,     // always get fresh positions
      timeout: 15000
    }
  );
}
``