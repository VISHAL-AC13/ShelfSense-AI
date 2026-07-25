// ============================================================================
// AETHER AI LOGISTICS & SHIPMENT INTELLIGENCE // ENTERPRISE DATA MODEL
// ============================================================================

export const userProfile = {
  name: "Dr. Alexander Vance",
  role: "VP of Global Autonomous Supply Chain",
  organization: "Aether Dynamics & Bio-Logistics",
  avatar: "AV",
  securityClearance: "Level 5 // Quantum AI Core",
  activeShipmentCount: 1428,
  systemStatus: "All Neural Nodes Nominal"
};

export const kpiMetrics = [
  {
    id: "kpi-1",
    title: "Active Monitored Shipments",
    value: "1,428",
    change: "+12.4%",
    isPositive: true,
    subtitle: "Across 48 global logistics corridors",
    icon: "Box",
    accentColor: "#10B981"
  },
  {
    id: "kpi-2",
    title: "AI Spoilage Prevented",
    value: "$4.82M",
    change: "+28.7%",
    isPositive: true,
    subtitle: "Real-time thermal & route intervention",
    icon: "ShieldCheck",
    accentColor: "#0EA5E9"
  },
  {
    id: "kpi-3",
    title: "Global AI Health Score",
    value: "98.4%",
    change: "+0.8%",
    isPositive: true,
    subtitle: "Optimal sensor stability index",
    icon: "Activity",
    accentColor: "#0D9488"
  },
  {
    id: "kpi-4",
    title: "Route Efficiency Gain",
    value: "18.4%",
    change: "-3.2 hrs",
    isPositive: true,
    subtitle: "Average transit reduction via neural routing",
    icon: "Zap",
    accentColor: "#6366F1"
  }
];

export const activeShipments = [
  {
    id: "SHP-9024",
    trackingNumber: "AETH-2026-QX9",
    cargo: "Quantum Superconducting Qubits (50mK Cryo)",
    client: "IBM Quantum Systems // Zurich Lab",
    origin: { city: "Zurich, CH", coords: [47.3769, 8.5417], port: "ZRH-CryoHub 4" },
    destination: { city: "Chicago, USA", coords: [41.8781, -87.6298], port: "ORD-TechPark 12" },
    status: "Active Transit",
    healthScore: 99.2,
    progress: 68,
    eta: "14h 20m remaining",
    currentLocation: "North Atlantic Air Corridor // FL380",
    vehicle: {
      type: "Autonomous Cargo Drone // HALE-800",
      id: "ACD-X04",
      battery: 92,
      signal: "Starlink Quantum LEO"
    },
    telemetry: {
      temperature: "-268.1°C",
      targetTemp: "-268.0°C",
      humidity: "0.02%",
      vibration: "0.01G (Nominal)",
      doorSeal: "Tamper Lock Active // Biometric Sealed",
      pressure: "101.3 kPa"
    },
    aiReasoning: "AETHER neural engine detected localized atmospheric turbulence over Iceland. Autonomously adjusted flight altitude by +2,000ft, reducing cargo vibration by 94% and preserving qubit coherence.",
    riskLevel: "Low",
    priority: "Critical"
  },
  {
    id: "SHP-4402",
    trackingNumber: "AETH-2026-BIO1",
    cargo: "mRNA Genomic Therapeutics (Cold Chain -70°C)",
    client: "Novartis Bio-Pharma // Global Distribution",
    origin: { city: "Basel, CH", coords: [47.5596, 7.5886], port: "BSL-BioHub 2" },
    destination: { city: "Singapore, SG", coords: [1.3521, 103.8198], port: "SIN-MedCenter" },
    status: "AI Intervention",
    healthScore: 88.5,
    progress: 42,
    eta: "22h 10m remaining",
    currentLocation: "Approaching Arabian Sea Corridor",
    vehicle: {
      type: "Autonomous Cryo-Freighter // Volvo FH16-E",
      id: "TRK-9902",
      battery: 84,
      signal: "5G-Advanced Uplink"
    },
    telemetry: {
      temperature: "-68.4°C",
      targetTemp: "-70.0°C",
      humidity: "12.4%",
      vibration: "0.08G (Nominal)",
      doorSeal: "Tamper Lock Active // Biometric Sealed",
      pressure: "101.1 kPa"
    },
    aiReasoning: "Cryogenic compressor #2 showed 1.6°C upward thermal drift. AI initiated secondary liquid nitrogen injection loop and rerouted transport via expedited priority customs channel at Singapore port.",
    riskLevel: "Moderate",
    priority: "High"
  },
  {
    id: "SHP-7719",
    trackingNumber: "AETH-2026-EUV4",
    cargo: "ASML High-NA EUV Optical Mirror Assembly",
    client: "TSMC // Fab 21 Advanced Lithography",
    origin: { city: "Eindhoven, NL", coords: [51.4416, 5.4697], port: "EIN-Optics Hub" },
    destination: { city: "Phoenix, USA", coords: [33.4484, -112.0740], port: "PHX-Fab 21 Gateway" },
    status: "Active Transit",
    healthScore: 97.8,
    progress: 84,
    eta: "5h 45m remaining",
    currentLocation: "Interstate 10 East // Arizona Desert",
    vehicle: {
      type: "Air-Suspension Autonomous Convoy // Unit 1",
      id: "CNV-008",
      battery: 89,
      signal: "Satellite Direct-to-Cell"
    },
    telemetry: {
      temperature: "20.1°C",
      targetTemp: "20.0°C",
      humidity: "35.0%",
      vibration: "0.002G (Ultra-Stable)",
      doorSeal: "Tamper Lock Active // Biometric Sealed",
      pressure: "101.4 kPa"
    },
    aiReasoning: "Predictive traffic model identified road resurfacing vibration on I-10 Exit 142. AETHER rerouted convoy to Highway 303 Bypass, preventing 0.4G peak vibration event.",
    riskLevel: "Low",
    priority: "Critical"
  },
  {
    id: "SHP-3381",
    trackingNumber: "AETH-2026-AERO",
    cargo: "Rolls-Royce Trent XWB Turbine Single-Crystal Blades",
    client: "Airbus Final Assembly Line // Toulouse",
    origin: { city: "Derby, UK", coords: [52.9225, -1.4746], port: "EMA-Aerospace Hub" },
    destination: { city: "Toulouse, FR", coords: [43.6047, 1.4442], port: "TLS-Airbus Hub" },
    status: "Delivered Optimal",
    healthScore: 99.9,
    progress: 100,
    eta: "Arrived at destination",
    currentLocation: "Toulouse Assembly Hangar B4",
    vehicle: {
      type: "Electric Express Rail // Euro Cargo 4",
      id: "RLL-552",
      battery: 100,
      signal: "Hardwired Optical Dock"
    },
    telemetry: {
      temperature: "18.5°C",
      targetTemp: "18.0°C",
      humidity: "40.2%",
      vibration: "0.01G (Nominal)",
      doorSeal: "Unlocked // Verified Handover",
      pressure: "101.3 kPa"
    },
    aiReasoning: "Zero anomalies detected throughout 950km transit. Total carbon footprint reduced by 64% via AI regenerative braking synchronization on rail gradient descent.",
    riskLevel: "None",
    priority: "Normal"
  }
];

export const liveAlerts = [
  {
    id: "ALT-101",
    shipmentId: "SHP-4402",
    title: "Thermal Drift Detected // Compressor #2",
    description: "Temperature rose by +1.6°C over 45 minutes in mRNA container.",
    severity: "Warning",
    timestamp: "2 mins ago",
    aiAction: "Autonomously engaged backup cryo-loop #3 and increased coolant flow by 25%. Thermal trajectory normalizing.",
    status: "Resolved by AI"
  },
  {
    id: "ALT-102",
    shipmentId: "SHP-9024",
    title: "Atmospheric Turbulence // FL380 North Atlantic",
    description: "Predicted Category 2 clear-air turbulence ahead on flight path.",
    severity: "Caution",
    timestamp: "14 mins ago",
    aiAction: "Rerouted autonomous flight trajectory +20nm North, maintaining sub-0.02G vibration profile.",
    status: "Preventative Action Taken"
  },
  {
    id: "ALT-103",
    shipmentId: "SHP-1109",
    title: "Customs Clearance Delay // Port of Rotterdam",
    description: "Automated document scanning queue latency increased by 4 hours.",
    severity: "Notice",
    timestamp: "42 mins ago",
    aiAction: "Submitted cryptographic digital trade certificate via EU Green Customs Gateway. Priority clearance granted.",
    status: "Cleared"
  }
];

export const chartTimeSeriesData = [
  { time: "00:00", health: 99.1, temp: -70.0, vibration: 0.02, anomalyScore: 0.2 },
  { time: "04:00", health: 98.9, temp: -69.8, vibration: 0.03, anomalyScore: 0.3 },
  { time: "08:00", health: 99.4, temp: -70.1, vibration: 0.01, anomalyScore: 0.1 },
  { time: "12:00", health: 97.8, temp: -68.4, vibration: 0.08, anomalyScore: 2.4 },
  { time: "16:00", health: 98.6, temp: -69.5, vibration: 0.04, anomalyScore: 0.8 },
  { time: "20:00", health: 99.2, temp: -70.0, vibration: 0.02, anomalyScore: 0.2 },
  { time: "24:00", health: 99.5, temp: -70.1, vibration: 0.01, anomalyScore: 0.1 }
];

export const aiAnalysisDetails = {
  healthScore: 98.4,
  confidenceScore: 99.7,
  activeModel: "AETHER-7 Quantum Transformer (v4.8)",
  parametersMonitored: "1.28 Billion telemetry points / sec",
  neuralNodes: "128 Global Edge GPU Clusters",
  riskTimeline: [
    { hour: "+0h", risk: 1.2, label: "Current State Nominal" },
    { hour: "+12h", risk: 2.8, label: "Approaching Equator Thermal Zone" },
    { hour: "+24h", risk: 4.5, label: "Port Customs Handover Peak" },
    { hour: "+36h", risk: 1.8, label: "Final Mile Electric Convoy" },
    { hour: "+48h", risk: 0.5, label: "Biometric Client Handover" }
  ],
  reasoningCards: [
    {
      id: "rs-1",
      title: "Predictive Thermal Spoilage Mitigation",
      confidence: "99.8%",
      impact: "$2.1M Cargo Saved",
      description: "Analysis of 10,000 historical cold-chain transits indicated a 62% likelihood of compressor seal fatigue under ambient equatorial heat (39°C). AETHER pre-cooled the container core to -72°C before entering the zone, creating a 6-hour thermal buffer.",
      statusBadge: "Executed Autonomously",
      icon: "ThermometerSnowflake"
    },
    {
      id: "rs-2",
      title: "Vibration Dampening & Route Optimization",
      confidence: "99.4%",
      impact: "Zero Micro-Fractures",
      description: "Real-time acoustic sensor telemetry from ASML EUV mirror convoy detected harmonic resonance at 84Hz on I-10 pavement. AI adjusted active air-suspension damping coefficients by +18% in 12 milliseconds.",
      statusBadge: "Active Monitoring",
      icon: "Activity"
    },
    {
      id: "rs-3",
      title: "Customs Cryptographic Green-Lane Routing",
      confidence: "98.9%",
      impact: "-14.2 Hours Idle Time",
      description: "By integrating with customs neural gateways in Zurich and Singapore, AETHER pre-cleared pharmaceutical biosecurity manifests using zero-knowledge blockchain proofs before cargo touchdown.",
      statusBadge: "Verified Protocol",
      icon: "FileCheck"
    }
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Optimize Battery Discharge Rate on SHP-9024",
      subtitle: "Reduce HALE drone cruising speed by 3 knots to preserve 8% reserve power upon Chicago touchdown.",
      actionText: "Apply Neural Speed Profile",
      impact: "+42 mins flight endurance",
      applied: false
    },
    {
      id: "rec-2",
      title: "Pre-Stage Liquid Nitrogen Refill at Port of Singapore",
      subtitle: "Automate dispatch of cryo-servicing vehicle to Berth 14 immediately upon docking of SHP-4402.",
      actionText: "Schedule Automated Servicing",
      impact: "Eliminates thermal risk window",
      applied: true
    },
    {
      id: "rec-3",
      title: "Update Geofence Biometric Access Rules for Zurich Port",
      subtitle: "Require two-factor quantum key authorization for door seal release on EUV optical assemblies.",
      actionText: "Enforce Quantum Security",
      impact: "Max biosecurity compliance",
      applied: false
    }
  ]
};

export const mcKinseyReportData = {
  title: "Autonomous Supply Chain Intelligence & ROI Assessment // Q3 2026",
  preparedFor: "Executive Board & Global Logistics Stakeholders",
  author: "AETHER AI Strategic Advisory & Quantitative Risk Practice",
  date: "July 25, 2026",
  executiveSummary: "Over the trailing 90-day operational period, AETHER's autonomous AI logistics platform monitored 14,280 high-value shipments totaling $4.2 Billion in insured cargo. By transitioning from reactive alerting to autonomous real-time intervention, the platform eliminated total loss events, delivering an annualized ROI of 840% and net cost savings of $14.8 Million.",
  keyMetrics: [
    { label: "Net Financial Loss Prevention", value: "$14.8M", delta: "+42% YoY", highlight: true },
    { label: "On-Time Delivery Rate", value: "99.94%", delta: "+3.8% vs Industry Avg", highlight: false },
    { label: "Carbon Footprint Reduction", value: "24,800 MT", delta: "-18.4% via AI Routing", highlight: false },
    { label: "Automated Resolution Rate", value: "94.2%", delta: "Zero Human Intervention", highlight: true }
  ],
  lossPreventionBreakdown: [
    { category: "Thermal Spoilage Prevention (Pharma/Cryo)", amount: "$8.4M", percentage: 57, color: "#10B981" },
    { category: "Vibration & Mechanical Damage Avoidance", amount: "$3.6M", percentage: 24, color: "#0EA5E9" },
    { category: "Customs Demurrage & Idle Time Elimination", amount: "$1.9M", percentage: 13, color: "#0D9488" },
    { category: "Theft & Biometric Security Interventions", amount: "$0.9M", percentage: 6, color: "#6366F1" }
  ],
  strategicRecommendations: [
    {
      number: "01",
      title: "Full Transition to Tier-5 Quantum Neural Routing",
      details: "McKinsey quantitative modeling demonstrates that upgrading the remaining 15% of legacy road freight to AETHER's autonomous routing protocol will capture an additional $3.2M in annual fuel and demurrage savings.",
      priority: "Immediate // Q4 2026"
    },
    {
      number: "02",
      title: "Expansion of Biometric Tamper-Lock Integration",
      details: "High-NA semiconductor shipments exhibit zero loss variance when paired with autonomous biometric seal verification at port transitions. We recommend mandating this standard across all Tier-1 technology clients.",
      priority: "Strategic // Q1 2027"
    },
    {
      number: "03",
      title: "Monetization of AI Carbon Offsets",
      details: "The 24,800 MT CO2 reduction achieved via regenerative convoy synchronization qualifies for EU verified green carbon credits, creating a new recurring revenue stream estimated at $1.4M annually.",
      priority: "Financial // Immediate"
    }
  ]
};
