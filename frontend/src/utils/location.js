// src/utils/location.js

// Helper: reverse geocode using OpenStreetMap Nominatim
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        // identify as demo app (Nominatim requirement)
        "User-Agent": "AyurTrace-Demo/1.0 (contact: demo@example.com)",
      },
    });
    if (!res.ok) {
      throw new Error("Reverse geocode failed");
    }
    const data = await res.json();
    // Try to build a nice location name
    return (
      data.display_name ||
      [data.address?.city, data.address?.state, data.address?.country]
        .filter(Boolean)
        .join(", ") ||
      "Unknown location"
    );
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return "Unknown location";
  }
}

// Main function called from FarmerPage
export async function getDeviceLocationWithName() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported in this browser");
      resolve({
        coords: null,
        locationName: "Location not available",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const locationName = await reverseGeocode(lat, lng);

        resolve({
          coords: { lat, lng },
          locationName,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        resolve({
          coords: null,
          locationName: "Location not allowed",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );
  });
}
