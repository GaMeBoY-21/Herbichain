// src/utils/reverseGeocode.js
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "AyurTrace-Demo-App" // required by Nominatim
      }
    });

    const data = await res.json();

    if (!data || !data.address) return "Unknown Location";

    const addr = data.address;

    // Pick nice readable values
    const city = addr.city || addr.town || addr.village || "";
    const district = addr.county || "";
    const state = addr.state || "";
    const country = addr.country || "";

    return `${city}, ${state}, ${country}`.replace(/^,|,$/g, "");
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return "Unknown Location";
  }
}
