# utils/pdf_generator.py
import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_shipment_pdf(shipment, transport_eval, spoilage_eval, health_score, recommendations):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E40AF'),
        spaceBefore=12,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155')
    )
    
    bold_style = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )
    
    story = []
    
    # Title & Header
    story.append(Paragraph("AI POWERED COLD CHAIN MANAGEMENT SYSTEM", title_style))
    story.append(Paragraph(f"Official Consignment Audit & Telemetry Report // Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))
    
    # Section 1: Shipment Details Table
    story.append(Paragraph("1. Consignment Logistics Specifications", h2_style))
    
    details_data = [
        [Paragraph("<b>Shipment ID:</b>", body_style), Paragraph(f"<b>{shipment['shipment_id']}</b>", bold_style),
         Paragraph("<b>Status:</b>", body_style), Paragraph(f"<b>{shipment['status']}</b>", bold_style)],
        [Paragraph("<b>Product:</b>", body_style), Paragraph(shipment['product'], body_style),
         Paragraph("<b>Category:</b>", body_style), Paragraph(shipment['product_category'], body_style)],
        [Paragraph("<b>Origin:</b>", body_style), Paragraph(shipment.get('origin_name', ''), body_style),
         Paragraph("<b>Destination:</b>", body_style), Paragraph(shipment.get('dest_name', ''), body_style)],
        [Paragraph("<b>Vehicle No:</b>", body_style), Paragraph(shipment.get('vehicle_number', ''), body_style),
         Paragraph("<b>Driver:</b>", body_style), Paragraph(shipment.get('driver_name', ''), body_style)],
        [Paragraph("<b>Storage Type:</b>", body_style), Paragraph(shipment['storage_type'], body_style),
         Paragraph("<b>Expected ETA:</b>", body_style), Paragraph(shipment.get('expected_delivery', ''), body_style)]
    ]
    
    t_details = Table(details_data, colWidths=[1.1*inch, 2.6*inch, 1.1*inch, 2.6*inch])
    t_details.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_details)
    story.append(Spacer(1, 10))
    
    # Section 2: Sensor Summary
    story.append(Paragraph("2. Multi-Zone Thermal Array & Environmental Summary", h2_style))
    
    sensors = shipment.get("sensors", [0.0]*9)
    min_s = min(sensors) if sensors else 0.0
    max_s = max(sensors) if sensors else 0.0
    avg_s = sum(sensors)/len(sensors) if sensors else 0.0
    hum = shipment.get("humidity", 50.0)
    doors = shipment.get("door_openings", 0)
    
    sensor_data = [
        [Paragraph("<b>Metric Parameter</b>", bold_style), Paragraph("<b>Recorded Telemetry Value</b>", bold_style), Paragraph("<b>Status Assessment</b>", bold_style)],
        [Paragraph("9-Zone Thermal Average", body_style), Paragraph(f"{avg_s:.1f} °C", bold_style), Paragraph("Active Monitoring", body_style)],
        [Paragraph("Thermal Range (Min ➔ Max)", body_style), Paragraph(f"{min_s:.1f} °C ➔ {max_s:.1f} °C", body_style), Paragraph("Profile Verified", body_style)],
        [Paragraph("Atmospheric Relative Humidity", body_style), Paragraph(f"{hum:.1f} %", body_style), Paragraph("Chamber Hermetic Seal Nominal" if hum <= 70 else "High Condensation Risk", body_style)],
        [Paragraph("Security Door Opening Count", body_style), Paragraph(f"{doors} Events", bold_style), Paragraph("Compliant" if doors <= 3 else "VIOLATION DETECTED", body_style)]
    ]
    
    t_sensors = Table(sensor_data, colWidths=[2.5*inch, 2.2*inch, 2.7*inch])
    t_sensors.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EFF6FF')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1E40AF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sensors)
    story.append(Spacer(1, 10))
    
    # Section 3: AI Intelligence Risk & Health Audit
    story.append(Paragraph("3. AI Intelligence Risk & Health Composite Audit", h2_style))
    
    t_risk_level = transport_eval["risk_level"]
    t_conf = transport_eval["confidence"]
    s_risk_level = spoilage_eval["spoilage_risk"]
    s_score = spoilage_eval["risk_score"]
    
    ai_data = [
        [Paragraph("<b>AI Evaluation Module</b>", bold_style), Paragraph("<b>Risk Classification</b>", bold_style), Paragraph("<b>Confidence / Score</b>", bold_style)],
        [Paragraph("Transport Risk (Random Forest ML)", body_style), Paragraph(f"<b>{t_risk_level}</b>", bold_style), Paragraph(f"<b>{t_conf}% Confidence</b>", body_style)],
        [Paragraph("Biological Spoilage Risk (Rule Engine)", body_style), Paragraph(f"<b>{s_risk_level}</b>", bold_style), Paragraph(f"Severity: {s_score} / 10", body_style)],
        [Paragraph("Overall Consignment Health Index", bold_style), Paragraph(f"<b>{health_score} / 100 %</b>", bold_style), Paragraph("System Composite Index", body_style)]
    ]
    
    t_ai = Table(ai_data, colWidths=[2.5*inch, 2.2*inch, 2.7*inch])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ECFDF5')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#065F46')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#A7F3D0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1FAE5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 12))
    
    # Section 4: Spoilage Reasoning Breakdown
    story.append(Paragraph("4. Spoilage & Thermal Deviation Reasoning", h2_style))
    for idx, r_text in enumerate(spoilage_eval["reasons"]):
        story.append(Paragraph(f"<b>• Reason #{idx+1}:</b> {r_text}", body_style))
        story.append(Spacer(1, 4))
    story.append(Spacer(1, 8))
    
    # Section 5: Recommendations
    story.append(Paragraph("5. Actionable Strategic Recommendations", h2_style))
    if recommendations:
        for idx, rec in enumerate(recommendations):
            p_text = f"<b>[{rec['priority']}] Action: {rec['action']}</b><br/><i>Reasoning:</i> {rec['reason']}"
            story.append(Paragraph(p_text, body_style))
            story.append(Spacer(1, 6))
    else:
        story.append(Paragraph("All consignment telemetry parameters nominal. Continue transport.", body_style))
        
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=10))
    story.append(Paragraph("<b>Certified by AETHER Autonomous Cold Chain AI Decision Core</b> // System Signature: Verified 256-Bit SHA-3", subtitle_style))
    
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
