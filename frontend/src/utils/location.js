// src/utils/location.js

// Helper: reverse geocode lat/lng → place name using OpenStreetMap
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await res.json();
    // Try nice names in order
    return (
      data.display_name ||
      data.name ||
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state ||
      "Unknown location"
    );
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return "Unknown location";
  }
}

// Main function: get coords + human-readable name
export async function getDeviceLocationWithName() {
  if (!("geolocation" in navigator)) {
    console.warn("Geolocation not supported in this browser.");
    return {
      coords: null,
      locationName: "Geolocation not supported",
    };
  }

  return new Promise((resolve) => {
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
        console.error("Error getting device location:", err);
        resolve({
          coords: null,
          locationName: "Location permission denied",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
}
