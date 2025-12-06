// src/utils/location.js

// Get browser coordinates as a Promise
function getBrowserCoords() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported in this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  });
}

// Reverse geocode using OpenStreetMap Nominatim (demo only)
async function reverseGeocode({ lat, lng }) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  const res = await fetch(url, {
    headers: {
      // Good practice: identify your app for the public API
      "User-Agent": "AyurTrace-Demo/1.0 (buildathon@example.com)",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to reverse geocode");
  }

  const data = await res.json();
  return data.display_name || "";
}

/**
 * Main helper to use in pages.
 * Returns { coords: {lat,lng}, locationName }
 */
export async function getDeviceLocationWithName() {
  try {
    const coords = await getBrowserCoords();
    let locationName = "";

    try {
      locationName = await reverseGeocode(coords);
    } catch (e) {
      console.warn("Reverse geocode failed:", e);
    }

    if (!locationName) {
      locationName = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    }

    return {
      coords,
      locationName,
    };
  } catch (e) {
    console.warn("Could not get device location:", e);
    return {
      coords: null,
      locationName: "Unknown location",
    };
  }
}
