// static/js/main.js
let allShipments = [];
let chartTempInst = null;
let chartHumInst = null;
let chartRiskInst = null;
let chartHealthInst = null;
let leafletMapInst = null;

document.addEventListener("DOMContentLoaded", () => {
    setupNav();
    loadStorageProfiles();
    fetchShipments().then(() => {
        renderDashboard();
    });
});

// Navigation Setup
function setupNav() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const targetSection = link.getAttribute("data-section");
            document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
            document.getElementById(targetSection).classList.add("active");

            // Refresh view
            if (targetSection === "section-dashboard") renderDashboard();
            if (targetSection === "section-live") loadLiveMonitoring();
            if (targetSection === "section-ai") loadAiAnalysis();
            if (targetSection === "section-gps") loadGpsTracking();
            if (targetSection === "section-reports") loadReports();
        });
    });
}

// Fetch Shipments from Flask REST API
async function fetchShipments() {
    try {
        const res = await fetch("/api/shipments");
        const json = await res.json();
        if (json.success) {
            allShipments = json.shipments;
            populateDropdowns();
        }
    } catch (err) {
        console.error("Error fetching shipments:", err);
    }
}

function populateDropdowns() {
    const ids = ["selectLiveShipment", "selectAiShipment", "selectGpsShipment", "selectRepShipment"];
    ids.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        const currentVal = select.value;
        select.innerHTML = "";
        allShipments.forEach((item, idx) => {
            const s = item.data;
            const opt = document.createElement("option");
            opt.value = s.shipment_id;
            opt.textContent = `${s.shipment_id} // ${s.product} (${s.status})`;
            select.appendChild(opt);
        });
        if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
            select.value = currentVal;
        }
    });
}

// ==============================================
// 1. DASHBOARD LOGIC
// ==============================================
function renderDashboard() {
    if (allShipments.length === 0) return;

    let total = allShipments.length;
    let active = 0, delivered = 0, alertsCount = 0;
    let avgTemps = [], avgHums = [], healthScores = [];
    let riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    let recsRows = [], alertRows = [];

    allShipments.forEach(item => {
        const s = item.data;
        const ai = item.ai;

        if (s.status === "Delivered") delivered++;
        else active++;

        if (s.alerts && s.alerts.length > 0) alertsCount += s.alerts.length;
        else if (s.status === "Critical") alertsCount++;

        if (s.status !== "Delivered") {
            if (s.sensors && s.sensors.length > 0) {
                let mean = s.sensors.reduce((a, b) => a + b, 0) / s.sensors.length;
                avgTemps.push(mean);
            }
            avgHums.push(s.humidity || 50.0);
            healthScores.push(ai.health_score);
        }

        riskCounts[ai.transport_risk.risk_level]++;

        ai.recommendations.forEach(r => {
            if (["CRITICAL", "HIGH", "MEDIUM"].includes(r.priority)) {
                recsRows.push({
                    id: s.shipment_id,
                    product: s.product,
                    priority: r.priority,
                    action: r.action,
                    reason: r.reason
                });
            }
        });

        if (s.alerts && s.alerts.length > 0) {
            s.alerts.forEach(a => {
                alertRows.push({ id: s.shipment_id, product: s.product, sev: "CRITICAL", text: a });
            });
        } else if (["Warning", "Critical"].includes(s.status)) {
            alertRows.push({ id: s.shipment_id, product: s.product, sev: s.status.toUpperCase(), text: `Status reported as ${s.status}` });
        }
    });

    // Update KPI Counters
    document.getElementById("kpiTotal").textContent = total;
    document.getElementById("kpiActive").textContent = active;
    document.getElementById("kpiDelivered").textContent = delivered;
    document.getElementById("kpiAlerts").textContent = alertsCount;
    document.getElementById("kpiAlertsSub").style.color = alertsCount > 0 ? "var(--red-primary)" : "var(--emerald-primary)";

    let overTemp = avgTemps.length > 0 ? (avgTemps.reduce((a,b)=>a+b,0)/avgTemps.length).toFixed(1) : "0.0";
    let overHum = avgHums.length > 0 ? (avgHums.reduce((a,b)=>a+b,0)/avgHums.length).toFixed(1) : "50.0";
    let overHealth = healthScores.length > 0 ? (healthScores.reduce((a,b)=>a+b,0)/healthScores.length).toFixed(1) : "100.0";

    document.getElementById("kpiAvgTemp").textContent = `${overTemp} °C`;
    document.getElementById("kpiAvgHum").textContent = `${overHum} %`;
    document.getElementById("kpiHealth").textContent = `${overHealth} %`;
    document.getElementById("kpiHealthSub").style.color = overHealth >= 85 ? "var(--emerald-primary)" : overHealth >= 70 ? "var(--amber-primary)" : "var(--red-primary)";

    // Draw Chart.js
    drawDashboardCharts(parseFloat(overTemp), parseFloat(overHum), riskCounts);

    // Populate Tables
    populateDashTables(allShipments, recsRows, alertRows);
}

function drawDashboardCharts(temp, hum, risks) {
    const hours = ["H-21", "H-18", "H-15", "H-12", "H-9", "H-6", "H-3", "Now"];

    // Temp Chart
    const ctxTemp = document.getElementById("chartTemp").getContext("2d");
    if (chartTempInst) chartTempInst.destroy();
    let tempData = hours.map((_, i) => parseFloat((temp + Math.sin(i)*0.4).toFixed(1)));
    chartTempInst = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Avg Temp (°C)',
                data: tempData,
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Hum Chart
    const ctxHum = document.getElementById("chartHum").getContext("2d");
    if (chartHumInst) chartHumInst.destroy();
    let humData = hours.map((_, i) => parseFloat((hum + Math.cos(i)*1.2).toFixed(1)));
    chartHumInst = new Chart(ctxHum, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Humidity (%)',
                data: humData,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }
    });

    // Risk Donut
    const ctxRisk = document.getElementById("chartRisk").getContext("2d");
    if (chartRiskInst) chartRiskInst.destroy();
    chartRiskInst = new Chart(ctxRisk, {
        type: 'doughnut',
        data: {
            labels: ['LOW Risk', 'MEDIUM Risk', 'HIGH Risk'],
            datasets: [{
                data: [risks.LOW, risks.MEDIUM, risks.HIGH],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
}

function populateDashTables(shipments, recs, alerts) {
    // Recent Shipments
    const tbodyS = document.getElementById("tableShipmentsBody");
    tbodyS.innerHTML = "";
    shipments.forEach(item => {
        const s = item.data;
        const badgeClass = s.status === "Critical" ? "badge-red" : s.status === "Warning" ? "badge-amber" : s.status === "Delivered" ? "badge-blue" : "badge-emerald";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${s.shipment_id}</strong></td>
            <td>${s.product}</td>
            <td>${s.product_category}</td>
            <td>${s.origin_name || ''} ➔ ${s.dest_name || ''}</td>
            <td><span style="font-weight:600; font-size:0.85rem;">${s.storage_type}</span></td>
            <td><span class="badge ${badgeClass}">${s.status}</span></td>
            <td>${s.expected_delivery || ''}</td>
        `;
        tbodyS.appendChild(tr);
    });

    // Recommendations
    const tbodyR = document.getElementById("tableRecsBody");
    tbodyR.innerHTML = "";
    if (recs.length === 0) {
        tbodyR.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--emerald-primary); font-weight:700;">✅ All consignments nominal. No priority interventions required.</td></tr>`;
    } else {
        recs.forEach(r => {
            const bClass = r.priority === "CRITICAL" ? "badge-red" : "badge-amber";
            tbodyR.innerHTML += `
                <tr>
                    <td><strong>${r.id}</strong></td>
                    <td>${r.product}</td>
                    <td><span class="badge ${bClass}">${r.priority}</span></td>
                    <td><strong style="color: var(--text-primary);">🚀 ${r.action}</strong></td>
                    <td style="font-size:0.85rem; color: var(--text-secondary);">${r.reason}</td>
                </tr>
            `;
        });
    }

    // Alerts
    const tbodyA = document.getElementById("tableAlertsBody");
    tbodyA.innerHTML = "";
    if (alerts.length === 0) {
        tbodyA.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--emerald-primary); font-weight:700;">✅ No active thermal excursions or door security alarms.</td></tr>`;
    } else {
        alerts.forEach(a => {
            const bClass = a.sev === "CRITICAL" ? "badge-red" : "badge-amber";
            tbodyA.innerHTML += `
                <tr>
                    <td><strong>${a.id}</strong></td>
                    <td>${a.product}</td>
                    <td><span class="badge ${bClass}">${a.sev}</span></td>
                    <td style="color: var(--red-primary); font-weight: 600;">⚠️ ${a.text}</td>
                </tr>
            `;
        });
    }
}

function switchDashTab(tabId, btn) {
    document.querySelectorAll(".dash-tab-content").forEach(c => c.style.display = "none");
    document.getElementById(tabId).style.display = "block";
    document.querySelectorAll(".tabs-header .tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// ==============================================
// 2. REGISTER SHIPMENT LOGIC
// ==============================================
async function loadStorageProfiles() {
    try {
        const res = await fetch("/api/storage_profiles");
        const json = await res.json();
        if (json.success) {
            const select = document.getElementById("regStorage");
            select.innerHTML = "";
            Object.keys(json.profiles).forEach(p => {
                const opt = document.createElement("option");
                opt.value = p;
                opt.textContent = `${p} (${json.profiles[p].min_temp}°C to ${json.profiles[p].max_temp}°C)`;
                select.appendChild(opt);
            });
        }
    } catch(err) { console.error("Error loading profiles:", err); }
}

async function handleRegister(event) {
    event.preventDefault();
    const payload = {
        shipment_id: document.getElementById("regId").value.trim(),
        product_category: document.getElementById("regCategory").value,
        product: document.getElementById("regProduct").value.trim(),
        storage_type: document.getElementById("regStorage").value,
        vehicle_number: document.getElementById("regVehicle").value.trim(),
        driver_name: document.getElementById("regDriver").value.trim(),
        origin_name: document.getElementById("regOrigin").value.trim(),
        dest_name: document.getElementById("regDest").value.trim(),
        origin_lat: parseFloat(document.getElementById("regOrigLat").value),
        origin_lon: parseFloat(document.getElementById("regOrigLon").value),
        dest_lat: parseFloat(document.getElementById("regDestLat").value),
        dest_lon: parseFloat(document.getElementById("regDestLon").value)
    };

    try {
        const res = await fetch("/api/shipments/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
            document.getElementById("regSuccessBox").style.display = "block";
            document.getElementById("regSuccessMsg").innerHTML = `Consignment <strong>${payload.shipment_id} (${payload.product})</strong> registered into storage! 9 thermal sensors initiated at nominal target temperature.`;
            await fetchShipments();
            document.getElementById("formRegister").reset();
        } else {
            alert("Error registering consignment: " + json.message);
        }
    } catch(err) {
        alert("Network error while registering consignment.");
    }
}

// ==============================================
// 3. LIVE MONITORING LOGIC
// ==============================================
function loadLiveMonitoring() {
    const select = document.getElementById("selectLiveShipment");
    if (!select || !select.value) return;
    const item = allShipments.find(x => x.data.shipment_id === select.value);
    if (!item) return;

    const s = item.data;
    const p = item.profile;

    document.getElementById("liveVehStat").textContent = s.vehicle_status || "In Transit";
    const shipStatEl = document.getElementById("liveShipStat");
    shipStatEl.textContent = s.status;
    shipStatEl.style.color = s.status === "Critical" ? "var(--red-primary)" : s.status === "Warning" ? "var(--amber-primary)" : "var(--emerald-primary)";
    document.getElementById("liveDuration").textContent = s.travel_duration || "4 hours";
    document.getElementById("liveStorage").innerHTML = `${s.storage_type} <span style="font-size:0.75rem; color:var(--text-muted);">(${p.min_temp}°C to ${p.max_temp}°C)</span>`;

    // 9 Thermal Sensors Grid (3x3)
    const grid = document.getElementById("sensorGrid3x3");
    grid.innerHTML = "";
    const labels = [
        "Sensor 1 (Front Top)", "Sensor 2 (Front Mid)", "Sensor 3 (Front Bottom)",
        "Sensor 4 (Mid Top)", "Sensor 5 (Core Center)", "Sensor 6 (Mid Bottom)",
        "Sensor 7 (Rear Top)", "Sensor 8 (Rear Mid)", "Sensor 9 (Rear Bottom near doors)"
    ];

    s.sensors.forEach((val, idx) => {
        let cardClass = "sensor-card";
        let badge = `<span class="badge badge-emerald">NOMINAL</span>`;
        let valColor = "var(--text-primary)";

        if (val < p.min_temp - 1.5 || val > p.max_temp + 1.5) {
            cardClass += " critical";
            badge = `<span class="badge badge-red">CRITICAL EXCURSION</span>`;
            valColor = "var(--red-primary)";
        } else if (val < p.min_temp || val > p.max_temp) {
            cardClass += " warning";
            badge = `<span class="badge badge-amber">ABNORMAL WARNING</span>`;
            valColor = "var(--amber-primary)";
        }

        let diff = (val - p.target_temp).toFixed(1);
        let diffStr = diff > 0 ? `+${diff}°C` : `${diff}°C`;

        const div = document.createElement("div");
        div.className = cardClass;
        div.innerHTML = `
            <div class="sensor-header">
                <span class="sensor-name">${labels[idx] || 'Sensor '+(idx+1)}</span>
                ${badge}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span class="sensor-value" style="color: ${valColor};">${val.toFixed(1)} °C</span>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Target: ${p.target_temp}°C (${diffStr})</span>
            </div>
        `;
        grid.appendChild(div);
    });

    // Environmental
    const hum = s.humidity || 50.0;
    document.getElementById("liveHumVal").textContent = `${hum.toFixed(1)} %`;
    document.getElementById("liveHumSub").textContent = hum > 70 ? "High condensation risk!" : hum < 25 ? "Dry compressor risk!" : "Nominal atmospheric stability";
    document.getElementById("cardHum").style.borderLeft = (30 <= hum && hum <= 70) ? "6px solid var(--emerald-primary)" : "6px solid var(--amber-primary)";

    const doors = s.door_openings || 0;
    document.getElementById("liveDoorVal").textContent = `${doors} Events`;
    document.getElementById("liveDoorSub").textContent = doors <= p.max_door_openings ? `Within profile protocol (Limit: ${p.max_door_openings})` : `VIOLATION: Exceeds limit (${p.max_door_openings})!`;
    document.getElementById("cardDoors").style.borderLeft = doors <= p.max_door_openings ? "6px solid var(--emerald-primary)" : "6px solid var(--red-primary)";

    // Update Simulator Sliders
    document.getElementById("simS9Input").value = s.sensors[8] || p.target_temp;
    document.getElementById("simS9Val").textContent = `${(s.sensors[8] || p.target_temp).toFixed(1)} °C`;
    document.getElementById("simHumInput").value = hum;
    document.getElementById("simHumVal").textContent = `${hum.toFixed(1)} %`;
    document.getElementById("simDoorInput").value = doors;
}

function toggleSim() {
    const body = document.getElementById("simBody");
    const arr = document.getElementById("simArrow");
    if (body.style.display === "none") {
        body.style.display = "block";
        arr.textContent = "−";
    } else {
        body.style.display = "none";
        arr.textContent = "+";
    }
}

async function applyTelemetryUpdate() {
    const select = document.getElementById("selectLiveShipment");
    if (!select || !select.value) return;

    const payload = {
        shipment_id: select.value,
        sensor9: parseFloat(document.getElementById("simS9Input").value),
        humidity: parseFloat(document.getElementById("simHumInput").value),
        door_openings: parseInt(document.getElementById("simDoorInput").value)
    };

    try {
        const res = await fetch("/api/telemetry/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
            alert(`✅ Telemetry updated for ${payload.shipment_id}! Status is now: ${json.status}`);
            await fetchShipments();
            loadLiveMonitoring();
        } else {
            alert("Error updating telemetry: " + json.message);
        }
    } catch(err) { alert("Network error updating telemetry."); }
}

// ==============================================
// 4. AI ANALYSIS LOGIC
// ==============================================
function loadAiAnalysis() {
    const select = document.getElementById("selectAiShipment");
    if (!select || !select.value) return;
    const item = allShipments.find(x => x.data.shipment_id === select.value);
    if (!item) return;

    const s = item.data;
    const ai = item.ai;
    const t = ai.transport_risk;
    const sp = ai.spoilage_risk;

    // Card 1
    const tEl = document.getElementById("aiTransLevel");
    tEl.textContent = t.risk_level;
    tEl.style.color = t.risk_level === "HIGH" ? "var(--red-primary)" : t.risk_level === "MEDIUM" ? "var(--amber-primary)" : "var(--emerald-primary)";
    document.getElementById("aiTransConf").textContent = `${t.confidence}%`;
    document.getElementById("aiTransProbs").innerHTML = `<strong>Class Probabilities:</strong><br>LOW: ${t.probabilities.LOW}% | MEDIUM: ${t.probabilities.MEDIUM}% | HIGH: ${t.probabilities.HIGH}%`;

    // Card 2
    const spEl = document.getElementById("aiSpoilLevel");
    spEl.textContent = sp.spoilage_risk;
    spEl.style.color = sp.spoilage_risk === "HIGH" ? "var(--red-primary)" : sp.spoilage_risk === "MEDIUM" ? "var(--amber-primary)" : "var(--emerald-primary)";
    document.getElementById("aiSpoilScore").textContent = `${sp.risk_score} / 10`;
    document.getElementById("aiSpoilProfile").innerHTML = `<strong>Evaluation Profile:</strong><br>${s.storage_type} protocol check`;

    // Card 3: Gauge
    document.getElementById("aiHealthText").textContent = `${ai.health_score}%`;
    document.getElementById("aiHealthText").style.color = ai.health_score >= 85 ? "var(--emerald-primary)" : ai.health_score >= 70 ? "var(--amber-primary)" : "var(--red-primary)";
    drawHealthGauge(ai.health_score);

    // Reasons List
    const reasonsBox = document.getElementById("aiReasonsList");
    reasonsBox.innerHTML = "";
    sp.reasons.forEach((r, idx) => {
        let icon = r.toLowerCase().includes("exceed") || r.toLowerCase().includes("violation") || r.toLowerCase().includes("severe") ? "⚠️" : r.toLowerCase().includes("moderate") ? "ℹ️" : "✅";
        reasonsBox.innerHTML += `<div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:8px; line-height:1.4;">${icon} <strong>Reason #${idx+1}:</strong> ${r}</div>`;
    });

    // Recommendations
    const recsBox = document.getElementById("aiRecsList");
    recsBox.innerHTML = "";
    if (ai.recommendations.length === 0) {
        recsBox.innerHTML = `<div class="card" style="background:#F0FDF4; border-color:#BBF7D0; color:#065F46;"><strong>✅ All telemetry parameters nominal. Continue transport.</strong></div>`;
    } else {
        ai.recommendations.forEach(rec => {
            let pColor = rec.priority === "CRITICAL" ? "var(--red-primary)" : rec.priority in ["HIGH", "MEDIUM"] ? "var(--amber-primary)" : "var(--emerald-primary)";
            let bgCol = rec.priority === "CRITICAL" ? "var(--red-light)" : rec.priority in ["HIGH", "MEDIUM"] ? "var(--amber-light)" : "var(--emerald-light)";
            let borderCol = rec.priority === "CRITICAL" ? "#FECACA" : rec.priority in ["HIGH", "MEDIUM"] ? "#FDE68A" : "#BBF7D0";

            recsBox.innerHTML += `
                <div class="card" style="background:${bgCol}; border:1px solid ${borderCol}; border-left:6px solid ${pColor}; padding:20px; margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:1.1rem; font-weight:800; color:var(--text-primary);">🚀 Action: ${rec.action}</span>
                        <span style="background:${pColor}; color:white; font-size:0.75rem; font-weight:700; padding:4px 12px; border-radius:12px; text-transform:uppercase;">Priority: ${rec.priority}</span>
                    </div>
                    <div style="font-size:0.92rem; color:var(--text-secondary); background:rgba(255,255,255,0.75); padding:12px 16px; border-radius:8px; border:1px solid rgba(0,0,0,0.05); margin-top:10px;">
                        <strong style="color:${pColor};">💡 Reason for Recommendation:</strong><br>${rec.reason}
                    </div>
                </div>
            `;
        });
    }
}

function drawHealthGauge(score) {
    const ctx = document.getElementById("chartHealthGauge").getContext("2d");
    if (chartHealthInst) chartHealthInst.destroy();

    let color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
    chartHealthInst = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [color, '#E2E8F0'],
                borderWidth: 0,
                circumference: 240,
                rotation: 240
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

// ==============================================
// 5. GPS TRACKING LOGIC
// ==============================================
function loadGpsTracking() {
    const select = document.getElementById("selectGpsShipment");
    if (!select || !select.value) return;
    const item = allShipments.find(x => x.data.shipment_id === select.value);
    if (!item) return;

    const s = item.data;
    const origLat = s.origin_lat || 47.5596, origLon = s.origin_lon || 7.5886;
    const destLat = s.dest_lat || 50.1109, destLon = s.dest_lon || 8.6821;
    const currLat = s.current_lat || origLat, currLon = s.current_lon || origLon;

    // Haversine dist
    const remDist = calcHaversine(currLat, currLon, destLat, destLon);
    const totDist = calcHaversine(origLat, origLon, destLat, destLon);
    const prog = s.progress_pct || 50;

    document.getElementById("gpsOrigName").textContent = s.origin_name || "Basel Hub";
    document.getElementById("gpsOrigCoords").textContent = `Coords: ${origLat}, ${origLon}`;
    document.getElementById("gpsDestName").textContent = s.dest_name || "Frankfurt Depot";
    document.getElementById("gpsDestCoords").textContent = `Coords: ${destLat}, ${destLon}`;
    document.getElementById("gpsCurrCoords").textContent = `${currLat}, ${currLon}`;
    document.getElementById("gpsVehStat").textContent = `Status: ${s.vehicle_status || 'In Transit'}`;
    document.getElementById("gpsEta").textContent = s.expected_delivery || "2026-07-26 14:00";
    document.getElementById("gpsTotDist").textContent = `Total Route Distance: ${totDist} km`;
    document.getElementById("gpsRemDist").textContent = `${remDist} km`;
    document.getElementById("gpsProgressText").textContent = `${prog} %`;
    document.getElementById("gpsProgressBar").style.width = `${prog}%`;

    // Initialize Leaflet Map
    setTimeout(() => {
        if (!leafletMapInst) {
            leafletMapInst = L.map("leafletMap").setView([currLat, currLon], 6);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 18, attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(leafletMapInst);
        } else {
            leafletMapInst.eachLayer(layer => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    leafletMapInst.removeLayer(layer);
                }
            });
        }

        const origIcon = L.divIcon({
            className: 'custom-pin',
            html: '<div style="background:#3B82F6; color:white; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);">ORIGIN</div>',
            iconSize: [60, 24], iconAnchor: [30, 12]
        });
        const destIcon = L.divIcon({
            className: 'custom-pin',
            html: '<div style="background:#10B981; color:white; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:bold; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);">DESTINATION</div>',
            iconSize: [80, 24], iconAnchor: [40, 12]
        });
        const truckIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="background:#0F172A; color:#10B981; padding:6px 10px; border-radius:20px; font-size:12px; font-weight:800; border:2px solid #10B981; box-shadow:0 4px 8px rgba(0,0,0,0.3);">🚛 VEHICLE (${s.vehicle_number})</div>`,
            iconSize: [130, 30], iconAnchor: [65, 15]
        });

        const pOrig = [origLat, origLon], pDest = [destLat, destLon], pCurr = [currLat, currLon];
        L.marker(pOrig, {icon: origIcon}).addTo(leafletMapInst).bindPopup(`<b>Origin:</b> ${s.origin_name||''}`);
        L.marker(pDest, {icon: destIcon}).addTo(leafletMapInst).bindPopup(`<b>Destination:</b> ${s.dest_name||''}`);
        L.marker(pCurr, {icon: truckIcon}).addTo(leafletMapInst).bindPopup(`<b>Current Truck:</b> ${s.status} (${prog}% complete)`);

        const polyline = L.polyline([pOrig, pCurr, pDest], {color: '#2563EB', weight: 4, opacity: 0.85, dashArray: '8, 8'}).addTo(leafletMapInst);
        leafletMapInst.fitBounds(polyline.getBounds(), {padding: [50, 50]});
    }, 150);
}

function calcHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
}

// ==============================================
// 6. REPORTS LOGIC
// ==============================================
function loadReports() {
    const select = document.getElementById("selectRepShipment");
    if (!select || !select.value) return;
    const item = allShipments.find(x => x.data.shipment_id === select.value);
    if (!item) return;

    const s = item.data;
    const ai = item.ai;

    document.getElementById("repCol1").innerHTML = `<strong>Shipment ID:</strong> ${s.shipment_id}<br><strong>Category:</strong> ${s.product_category}<br><strong>Product:</strong> ${s.product}`;
    document.getElementById("repCol2").innerHTML = `<strong>Origin:</strong> ${s.origin_name||''}<br><strong>Destination:</strong> ${s.dest_name||''}<br><strong>Vehicle:</strong> ${s.vehicle_number||''}`;
    document.getElementById("repCol3").innerHTML = `<strong>Driver:</strong> ${s.driver_name||''}<br><strong>Storage Profile:</strong> ${s.storage_type}<br><strong>ETA:</strong> ${s.expected_delivery||''}`;

    const sensors = s.sensors || [0.0];
    let mean = (sensors.reduce((a,b)=>a+b,0)/sensors.length).toFixed(1);
    let minS = Math.min(...sensors).toFixed(1), maxS = Math.max(...sensors).toFixed(1);
    document.getElementById("repAvgTemp").textContent = `${mean} °C`;
    document.getElementById("repRange").textContent = `${minS} to ${maxS} °C`;
    document.getElementById("repHum").textContent = `${(s.humidity||50).toFixed(1)} %`;
    document.getElementById("repDoors").textContent = `${s.door_openings||0} Events`;

    document.getElementById("repTransRisk").textContent = `${ai.transport_risk.risk_level} (${ai.transport_risk.confidence}%)`;
    document.getElementById("repSpoilRisk").textContent = `${ai.spoilage_risk.spoilage_risk} (Sev: ${ai.spoilage_risk.risk_score}/10)`;
    document.getElementById("repHealth").textContent = `${ai.health_score} / 100 %`;

    const rList = document.getElementById("repReasonsList");
    rList.innerHTML = "";
    ai.spoilage_risk.reasons.forEach((r, idx) => {
        rList.innerHTML += `<div style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:4px;">• <strong>Reason #${idx+1}:</strong> ${r}</div>`;
    });

    const recBox = document.getElementById("repRecsList");
    recBox.innerHTML = "";
    ai.recommendations.forEach(rec => {
        recBox.innerHTML += `<div style="padding:10px 14px; background:#F8FAFC; border:1px solid var(--border-color); border-radius:8px; margin-bottom:8px;"><strong>[${rec.priority}] Action: ${rec.action}</strong> — <em>${rec.reason}</em></div>`;
    });
}

function downloadPdfReport() {
    const select = document.getElementById("selectRepShipment");
    if (!select || !select.value) return;
    window.location.href = `/api/reports/download/${select.value}`;
}
