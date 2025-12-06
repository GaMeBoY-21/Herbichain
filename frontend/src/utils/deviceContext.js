// src/utils/deviceContext.js
import { reverseGeocode } from "./reverseGeocode.js";

export function getDeviceContext() {
  return new Promise((resolve) => {
    const now = new Date();

    if (!navigator.geolocation) {
      resolve({
        timestamp: now,
        coords: null,
        place: null
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // ⬅️ NEW — Reverse geocode to get location name
        const placeName = await reverseGeocode(lat, lng);

        resolve({
          timestamp: now,
          coords: { lat, lng, accuracy: pos.coords.accuracy },
          place: placeName
        });
      },
      (err) => {
        console.error("Geolocation error:", err);

        resolve({
          timestamp: now,
          coords: null,
          place: null
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}
