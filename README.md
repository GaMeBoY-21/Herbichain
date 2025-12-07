🌿 Herbichain

AI-powered blockchain traceability for Ayurvedic herb supply chains

Herbichain solves one core problem:
Consumers cannot verify the authenticity or journey of herbal products.

Our system creates an end-to-end transparent supply chain using:

A simple blockchain ledger (tamper-evident audit trail)

Role-based workflow (Farmer → Lab → Manufacturer → Distributor → Regulator → Consumer)

QR-code based verification

AI-generated supply chain summaries for consumers

🚀 What Herbichain Does
✔ 1. Farmers

Record the origin of herbs with:

Herb name

Species

Automatically captured GPS location + address

Timestamp

A harvest event is recorded on-chain.

✔ 2. Labs

Upload test results (purity/safety).
A LAB_TEST event is added to the blockchain with its own location/timestamp.

✔ 3. Manufacturers

Convert the raw herb into a commercial product.
They generate a QR code that consumers will scan.
A MANUFACTURING event is added to the blockchain.

✔ 4. Distributors

Record shipment and distribution details.
Adds a DISTRIBUTION event to the ledger.

✔ 5. Regulators

View the entire supply chain and:

Detect missing test steps

View high-risk batches

Audit the blockchain integrity

✔ 6. Consumers

Enter or scan the QR code to check:

Origin (farmer + location)

All lifecycle events

Geotag data

Test results

Manufacturing & shipping data

⭐ AI Feature

Consumers can click “Ask AI to explain the timeline”
AI reads the full batch history and generates a:

Simple

Human-friendly

Trust-building

explanation of the product’s journey.

🔗 Why Blockchain?

We store every update as a block with:

SHA-256 hash

Previous hash

Timestamp

Batch ID

Snapshot of event data

This creates a tamper-evident chain that ensures trust across the supply chain, without running a heavy blockchain network.

🏗 Tech Used
Frontend

React + Vite

Firebase Authentication

Geolocation API

QR generation

Backend

Node.js + Express

SQLite database

Custom lightweight blockchain

OpenAI API for AI explanations

🎯 Problem We Solve

Ayurvedic and herbal products suffer from:

Fake claims

Adulteration

No traceability

No consumer trust

Herbichain provides full transparency, trust, and AI-powered insights.

📌 One-Line Summary for Judges

Herbichain brings transparency to the herbal supply chain using blockchain, AI, GPS data, and QR codes—allowing consumers to trust what they buy with verifiable origin and AI-explained product history.
