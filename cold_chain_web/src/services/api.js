// src/services/api.js - Python Flask REST API Client

const API_BASE = ""; // Relative path uses Vite proxy or Flask static file hosting

export async function fetchShipments() {
  const res = await fetch(`${API_BASE}/api/shipments`);
  if (!res.ok) throw new Error("Failed to fetch shipments from Python backend");
  return await res.json();
}

export async function fetchShipment(id) {
  const res = await fetch(`${API_BASE}/api/shipments/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch shipment ${id}`);
  return await res.json();
}

export async function registerShipmentApi(shipmentData) {
  const res = await fetch(`${API_BASE}/api/shipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shipmentData)
  });
  if (!res.ok) throw new Error("Failed to register shipment in SQLite");
  return await res.json();
}

export async function updateTelemetryApi(id, sensors, humidity, door_openings) {
  const res = await fetch(`${API_BASE}/api/shipments/${id}/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sensors, humidity, door_openings })
  });
  if (!res.ok) throw new Error("Failed to submit telemetry to Python ML engine");
  return await res.json();
}

export async function executeInterventionApi(id, intervention_title, intervention_type = "THERMAL_OVERRIDE") {
  const res = await fetch(`${API_BASE}/api/shipments/${id}/intervene`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intervention_title, intervention_type })
  });
  if (!res.ok) throw new Error("Failed to execute intervention on backend");
  return await res.json();
}

export async function resetDemoApi() {
  const res = await fetch(`${API_BASE}/api/demo/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to reset demo data on backend");
  return await res.json();
}
