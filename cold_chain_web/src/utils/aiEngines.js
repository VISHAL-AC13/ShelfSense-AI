// src/utils/aiEngines.js - Client-Side AI Engine for Food Cold Chain & Spoilage Prediction
import { STORAGE_PROFILES } from "../data/mockData";

/**
 * Predict Transport Risk (Simulated Random Forest Classifier for Agri-Food Logistics)
 */
export function predictTransportRisk(shipment) {
  if (shipment && shipment.ai_eval && shipment.ai_eval.transport_risk) {
    return shipment.ai_eval.transport_risk;
  }

  let score = 0;
  if (shipment.delay_hours > 0) score += shipment.delay_hours * 18;
  if (shipment.door_openings > 3) score += (shipment.door_openings - 3) * 12;

  const profile = STORAGE_PROFILES[shipment.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
  if (shipment.sensors && shipment.sensors.length > 0) {
    const mean = shipment.sensors.reduce((a, b) => a + b, 0) / shipment.sensors.length;
    if (mean > profile.max_temp) score += (mean - profile.max_temp) * 25;
    else if (mean < profile.min_temp) score += (profile.min_temp - mean) * 25;
  }

  let riskLevel = "LOW";
  let conf = 94.5;
  let probs = { LOW: 88, MEDIUM: 9, HIGH: 3 };

  if (score >= 50 || shipment.status === "Critical") {
    riskLevel = "HIGH";
    conf = 96.8;
    probs = { LOW: 5, MEDIUM: 12, HIGH: 83 };
  } else if (score >= 20 || shipment.status === "Warning") {
    riskLevel = "MEDIUM";
    conf = 91.2;
    probs = { LOW: 18, MEDIUM: 68, HIGH: 14 };
  }

  return { risk_level: riskLevel, confidence: conf, probabilities: probs, risk_score_numeric: score };
}

/**
 * Evaluate Spoilage Risk (Rule-Based Expert System for Food Perishables)
 */
export function evaluateSpoilageRisk(shipment) {
  if (shipment && shipment.ai_eval && shipment.ai_eval.spoilage_risk) {
    return shipment.ai_eval.spoilage_risk;
  }

  const profile = STORAGE_PROFILES[shipment.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
  let reasons = [];
  let riskScore = 1.0; // Scale 0.0 to 10.0

  const sensors = shipment.sensors || Array(9).fill(profile.target_temp);
  const meanTemp = sensors.reduce((a, b) => a + b, 0) / sensors.length;
  const maxObserved = Math.max(...sensors);
  const minObserved = Math.min(...sensors);

  // Rule 1: High Temperature Excursion
  if (maxObserved > profile.max_temp + 1.5) {
    riskScore += 4.5;
    reasons.push(`CRITICAL THERMAL EXCURSION: Peak temperature reached ${maxObserved.toFixed(1)}°C (Limit: ${profile.max_temp}°C). Accelerates enzymatic breakdown and fungal rot.`);
  } else if (maxObserved > profile.max_temp) {
    riskScore += 2.0;
    reasons.push(`MILD WARM DRIFT: Sensor reading ${maxObserved.toFixed(1)}°C exceeds optimal ${profile.max_temp}°C ceiling.`);
  }

  // Rule 2: Chilling Injury
  if (minObserved < profile.min_temp - 1.0) {
    riskScore += 3.5;
    reasons.push(`CHILLING INJURY WARNING: Temperature dropped to ${minObserved.toFixed(1)}°C below ${profile.min_temp}°C floor.`);
  }

  // Rule 3: Humidity Abnormalities
  const hum = shipment.humidity || 75.0;
  if (hum > 88.0) {
    riskScore += 1.8;
    reasons.push(`EXCESSIVE HUMIDITY (${hum.toFixed(1)}%): High moisture condensation promotes Botrytis rot on fresh produce.`);
  } else if (hum < 50.0 && !shipment.storage_type.includes("Frozen")) {
    riskScore += 2.2;
    reasons.push(`DESICCATION RISK (${hum.toFixed(1)}%): Low humidity causes severe wilting in leafy greens.`);
  }

  // Rule 4: Security Door Access
  if (shipment.door_openings > profile.max_door_openings) {
    riskScore += 2.0;
    reasons.push(`DOOR ACCESS VIOLATION (${shipment.door_openings} events vs limit ${profile.max_door_openings}): Repeated warm air influx causes surface condensation.`);
  }

  // Rule 5: Transit Delay
  if (shipment.delay_hours > 2.0) {
    riskScore += 1.5;
    reasons.push(`LOGISTICS DELAY (${shipment.delay_hours} hrs): Extended transit time reduces retail shelf-life.`);
  }

  if (reasons.length === 0) {
    reasons.push(`Optimal Food Safety Envelope: All 9 thermal sensors, humidity (${hum.toFixed(1)}%), and door access events strictly comply with the ${shipment.storage_type} protocol.`);
  }

  riskScore = Math.min(10.0, Math.max(0.5, parseFloat(riskScore.toFixed(1))));

  let spoilageLevel = "LOW";
  if (riskScore >= 6.5) spoilageLevel = "HIGH";
  else if (riskScore >= 3.2) spoilageLevel = "MEDIUM";

  return { risk_score: riskScore, spoilage_risk: spoilageLevel, reasons };
}

/**
 * Calculate Composite Shipment Health Index (0-100%)
 */
export function calculateHealthScore(shipment, spoilRisk) {
  if (shipment && shipment.ai_eval && shipment.ai_eval.health_score !== undefined) {
    return shipment.ai_eval.health_score;
  }

  if (shipment.status === "Delivered") return 100;
  let health = 100 - (spoilRisk.risk_score * 8.5);
  if (shipment.status === "Critical") health -= 12;
  else if (shipment.status === "Warning") health -= 5;

  return Math.max(10, Math.min(100, Math.round(health)));
}

/**
 * Generate Prescriptive Operational Actions
 */
export function generateRecommendations(shipment, transRisk, spoilRisk, healthScore) {
  if (shipment && shipment.ai_eval && shipment.ai_eval.recommendations) {
    return shipment.ai_eval.recommendations;
  }

  let recs = [];
  const profile = STORAGE_PROFILES[shipment.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];

  if (spoilRisk.risk_score >= 6.5 || shipment.status === "Critical") {
    recs.push({
      priority: "CRITICAL",
      action: `Immediate Compressor Override & Quality Inspection at Next Hub`,
      reason: `Spoilage severity score reached ${spoilRisk.risk_score}/10. Force trailer cooling system to target ${profile.target_temp}°C and perform immediate sensory check for soft decay or wilting.`
    });
    recs.push({
      priority: "HIGH",
      action: `Expedite Priority Dock Unloading & Bypass Intermediate Transit`,
      reason: `Consignment health index degraded to ${healthScore}%. Route shipment directly to distribution center cold rooms to salvage retail shelf-life.`
    });
  } else if (spoilRisk.risk_score >= 3.2 || shipment.status === "Warning") {
    recs.push({
      priority: "HIGH",
      action: `Adjust Rear Chamber Airflow & Verify Door Seal Integrity`,
      reason: `Minor temperature drift or door access detected. Ensure cargo pallets are not blocking evaporator air circulation.`
    });
    recs.push({
      priority: "MEDIUM",
      action: `Notify Receiving QC Team for Priority Shelf-Life Evaluation`,
      reason: `Moderate transit stress detected. Inform warehouse quality control to prioritize this consignment during receiving intake.`
    });
  } else {
    recs.push({
      priority: "NOMINAL",
      action: `Maintain Standard Transit Velocity & Automated Telemetry Logging`,
      reason: `Consignment health is optimal at ${healthScore}%. Continue real-time GPS tracking and 9-zone thermal monitoring.`
    });
  }

  return recs;
}
