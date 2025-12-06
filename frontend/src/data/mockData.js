// src/data/mockData.js

export const batchesMock = [
  {
    id: "BATCH-001",
    herbName: "Ashwagandha Roots",
    species: "Withania somnifera",
    farmerName: "Ramesh Kumar",
    location: "Satara, Maharashtra, India",
    geo: { lat: 17.6800, lng: 74.0183 },
    status: "At Manufacturer",
    qrCodeValue: "BATCH-001",
    events: [
      {
        type: "HARVEST",
        by: "Farmer",
        actorName: "Ramesh Kumar",
        timestamp: "2025-12-06 08:30",
        details: "Harvested 150 kg Ashwagandha roots.",
        locationName: "Satara, Maharashtra, India",
        geo: { lat: 17.6800, lng: 74.0183 },
      },
      {
        type: "LAB_TEST",
        by: "Lab",
        actorName: "AyurLab Pune",
        timestamp: "2025-12-06 12:00",
        details:
          "Passed quality test. Checked for heavy metals, pesticides, moisture.",
        labReportIpfsHash: "QmABC123",
        locationName: "Pune, Maharashtra, India",
        geo: { lat: 18.5204, lng: 73.8567 },
      },
      {
        type: "MANUFACTURING",
        by: "Manufacturer",
        actorName: "HerbalCare Pvt Ltd",
        timestamp: "2025-12-06 15:00",
        details: "Processed into extract batch EX-ASH-09.",
        locationName: "Mumbai, Maharashtra, India",
        geo: { lat: 19.0760, lng: 72.8777 },
      },
    ],
  },
];
