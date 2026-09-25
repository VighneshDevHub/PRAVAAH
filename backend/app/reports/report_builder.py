import os
import json
import datetime
from typing import Dict, Any
from jinja2 import Environment, FileSystemLoader
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from app.core.config import settings
from app.ml.recommendation import generate_posture_recommendations

def json_serializer(obj):
    """Custom JSON serializer for datetime, date, and UUID objects."""
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    return str(obj)

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to calculate total page count and render running header & footer.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (Top bar)
        self.drawString(54, 750, "PRAVAAH  ·  CRYPTOGRAPHIC SECURITY POSTURE REPORT")
        self.setFont("Helvetica", 8)
        self.drawRightString(612 - 54, 750, "NTRO SIH 26159  |  CONFIDENTIAL")
        
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 742, 612 - 54, 742)
        
        # Footer (Bottom bar)
        self.line(54, 50, 612 - 54, 50)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 36, "National Technical Research Organisation (NTRO)  ·  AI Forensic Engine v1.0.0")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 36, page_str)
        
        self.restoreState()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PRAVAAH Forensic Report - {{ job.filename }}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
        .container { max-width: 1000px; margin: 0 auto; background: #1e293b; padding: 40px; border-radius: 12px; border: 1px solid #334155; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #38bdf8; }
        .badge { padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; }
        .badge-critical { background: #7f1d1d; color: #fca5a5; border: 1px solid #ef4444; }
        .badge-high { background: #7c2d12; color: #fdba74; border: 1px solid #f97316; }
        .badge-moderate { background: #713f12; color: #fde047; border: 1px solid #eab308; }
        .badge-low { background: #14532d; color: #86efac; border: 1px solid #22c55e; }
        .score-card { background: #0f172a; padding: 24px; border-radius: 8px; margin: 24px 0; display: flex; align-items: center; justify-content: space-between; border: 1px solid #334155; }
        .score-number { font-size: 48px; font-weight: bold; }
        .section-title { font-size: 20px; font-weight: bold; border-left: 4px solid #38bdf8; padding-left: 12px; margin-top: 32px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; font-size: 14px; }
        th { background-color: #0f172a; color: #94a3b8; font-weight: 600; }
        .footer { margin-top: 40px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #334155; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <div class="logo">PRAVAAH</div>
                <div style="color: #94a3b8; font-size: 14px;">AI-Assisted Cryptographic Security Posture Assessment</div>
            </div>
            <div>
                <span class="badge badge-{{ job.risk_category.lower() }}">{{ job.risk_category }} RISK</span>
            </div>
        </div>

        <div class="score-card">
            <div>
                <div style="color: #94a3b8; font-size: 14px;">Overall Cryptographic Posture Score</div>
                <div style="font-size: 14px; color: #cbd5e1; margin-top: 4px;">File: {{ job.filename }} | Sessions Analyzed: {{ job.total_sessions }}</div>
            </div>
            <div class="score-number" style="color: {% if job.risk_score < 50 %}#ef4444{% elif job.risk_score < 70 %}#f97316{% elif job.risk_score < 85 %}#eab308{% else %}#22c55e{% endif %};">
                {{ job.risk_score }}/100
            </div>
        </div>

        <div class="section-title">Email Protocol Traffic Distribution</div>
        <table>
            <thead>
                <tr>
                    <th>Protocol</th>
                    <th>Port(s)</th>
                    <th>Session Count</th>
                    <th>Encryption State</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>SMTP</td>
                    <td>25, 587, 465</td>
                    <td>{{ job.smtp_count }}</td>
                    <td>Implicit / STARTTLS</td>
                </tr>
                <tr>
                    <td>IMAP</td>
                    <td>143, 993</td>
                    <td>{{ job.imap_count }}</td>
                    <td>Implicit / STARTTLS</td>
                </tr>
                <tr>
                    <td>POP3</td>
                    <td>110, 995</td>
                    <td>{{ job.pop3_count }}</td>
                    <td>Implicit / STLS</td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">Prioritized Forensic Findings</div>
        <table>
            <thead>
                <tr>
                    <th>Severity</th>
                    <th>Rule / Finding</th>
                    <th>Category</th>
                    <th>Standard Reference</th>
                </tr>
            </thead>
            <tbody>
                {% for f in findings %}
                <tr>
                    <td><span class="badge badge-{{ f.severity.lower() }}">{{ f.severity }}</span></td>
                    <td><strong>{{ f.title }}</strong><br/><span style="color: #94a3b8; font-size: 12px;">{{ f.description }}</span></td>
                    <td>{{ f.category }}</td>
                    <td><code>{{ f.standard_ref }}</code></td>
                </tr>
                {% else %}
                <tr>
                    <td colspan="4" style="text-align: center; color: #86efac;">No cryptographic vulnerabilities detected in analyzed sessions.</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>

        <div class="section-title">Actionable Security Recommendations</div>
        <ol>
            {% for r in recommendations %}
            <li style="margin-bottom: 12px;">
                <strong>[{{ r.priority }}] {{ r.title }}</strong> - <em>{{ r.standard_ref }}</em><br/>
                <span style="color: #cbd5e1;">{{ r.recommendation }}</span>
            </li>
            {% endfor %}
        </ol>

        <div class="footer">
            Generated by PRAVAAH v1.0.0 | NTRO Cryptographic Posture Assessment Framework | Date: {{ now }}
        </div>
    </div>
</body>
</html>
"""

SEV_COLORS = {
    "CRITICAL": colors.HexColor("#dc2626"),
    "HIGH":     colors.HexColor("#ea580c"),
    "MODERATE": colors.HexColor("#d97706"),
    "MEDIUM":   colors.HexColor("#d97706"),
    "LOW":      colors.HexColor("#16a34a"),
    "INFO":     colors.HexColor("#2563eb"),
}

SEV_BG_COLORS = {
    "CRITICAL": colors.HexColor("#fef2f2"),
    "HIGH":     colors.HexColor("#fff7ed"),
    "MODERATE": colors.HexColor("#fefce8"),
    "MEDIUM":   colors.HexColor("#fefce8"),
    "LOW":      colors.HexColor("#f0fdf4"),
    "INFO":     colors.HexColor("#eff6ff"),
}

def generate_reports(job_data: Dict[str, Any], sessions_data: list, findings_data: list) -> Dict[str, str]:
    """
    Generates JSON, HTML, and PDF reports for a completed job and returns file paths.
    Uses datetime JSON serializer to prevent serialization errors.
    """
    job_id = job_data["id"]
    recommendations = generate_posture_recommendations(findings_data, job_data["risk_score"])
    
    # 1. JSON Report
    json_filename = f"report_{job_id}.json"
    json_path = settings.REPORTS_DIR / json_filename
    full_report = {
        "job": job_data,
        "summary": {
            "total_sessions": job_data["total_sessions"],
            "risk_score": job_data["risk_score"],
            "risk_category": job_data["risk_category"],
            "protocol_breakdown": {
                "smtp": job_data["smtp_count"],
                "imap": job_data["imap_count"],
                "pop3": job_data["pop3_count"]
            }
        },
        "sessions": sessions_data,
        "findings": findings_data,
        "recommendations": recommendations,
        "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(full_report, f, indent=2, default=json_serializer)

    # 2. HTML Report
    html_filename = f"report_{job_id}.html"
    html_path = settings.REPORTS_DIR / html_filename
    template = Environment(loader=FileSystemLoader(".")).from_string(HTML_TEMPLATE)
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    rendered_html = template.render(
        job=job_data,
        findings=findings_data,
        recommendations=recommendations,
        now=now_str
    )
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    # 3. PDF Report (Professional ReportLab Document)
    pdf_filename = f"report_{job_id}.pdf"
    pdf_path = settings.REPORTS_DIR / pdf_filename
    
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=64,
    )
    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a"),
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b"),
    )
    section_h2 = ParagraphStyle(
        "SectionH2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=14,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )
    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white,
    )

    # Top Document Title Header
    story.append(Paragraph("FORENSIC CRYPTOGRAPHIC POSTURE ASSESSMENT REPORT", title_style))
    story.append(Paragraph(f"Analysis Target: <b>{job_data['filename']}</b>  |  Job ID: {job_id[:8]}...  |  Generated: {now_str}", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=12))

    # Executive Summary Card Table
    risk_cat = str(job_data.get("risk_category", "UNKNOWN")).upper()
    risk_score = job_data.get("risk_score", 0)
    score_color = SEV_COLORS.get(risk_cat, colors.HexColor("#2563eb"))
    
    summary_card_data = [
        [
            Paragraph(
                f"<b>Overall Risk Score:</b> <font size=18 color='{score_color.hexval()}'><b>{risk_score}/100</b></font><br/>"
                f"<b>Posture Classification:</b> <font color='{score_color.hexval()}'><b>{risk_cat} RISK</b></font><br/>"
                f"<font color='#64748b'>Evaluated against NIST SP 800-52 Rev 2 & RFC 8314 Guidelines</font>",
                body_style
            ),
            Paragraph(
                f"<b>Sessions Analyzed:</b> {job_data.get('total_sessions', 0)}<br/>"
                f"<b>SMTP Sessions:</b> {job_data.get('smtp_count', 0)}<br/>"
                f"<b>IMAP Sessions:</b> {job_data.get('imap_count', 0)}<br/>"
                f"<b>POP3 Sessions:</b> {job_data.get('pop3_count', 0)}",
                body_style
            )
        ]
    ]
    summary_table = Table(summary_card_data, colWidths=[270, 234])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    # Protocol Breakdown Section
    story.append(Paragraph("1. Traffic & Protocol Breakdown", section_h2))
    proto_table_data = [
        [
            Paragraph("Protocol", table_header_style),
            Paragraph("Standard Port(s)", table_header_style),
            Paragraph("Session Count", table_header_style),
            Paragraph("Encryption Enforcement", table_header_style)
        ],
        [
            Paragraph("SMTP", body_style),
            Paragraph("25, 587, 465", body_style),
            Paragraph(str(job_data.get("smtp_count", 0)), body_style),
            Paragraph("Implicit TLS / STARTTLS", body_style)
        ],
        [
            Paragraph("IMAP", body_style),
            Paragraph("143, 993", body_style),
            Paragraph(str(job_data.get("imap_count", 0)), body_style),
            Paragraph("Implicit TLS / STARTTLS", body_style)
        ],
        [
            Paragraph("POP3", body_style),
            Paragraph("110, 995", body_style),
            Paragraph(str(job_data.get("pop3_count", 0)), body_style),
            Paragraph("Implicit TLS / STLS", body_style)
        ],
    ]
    proto_table = Table(proto_table_data, colWidths=[100, 110, 110, 184])
    proto_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#ffffff")),
    ]))
    story.append(proto_table)
    story.append(Spacer(1, 14))

    # Detailed Session Forensics Section (Up to 10 session logs)
    if sessions_data:
        story.append(Paragraph("2. Session Forensics & Cryptographic Telemetry", section_h2))
        sess_rows = [
            [
                Paragraph("Proto", table_header_style),
                Paragraph("Source Endpoint", table_header_style),
                Paragraph("Destination Endpoint", table_header_style),
                Paragraph("TLS Version & Cipher", table_header_style),
                Paragraph("Cert Status", table_header_style)
            ]
        ]
        for s in sessions_data[:10]:
            proto = str(s.get("protocol", "SMTP")).upper()
            src = f"{s.get('src_ip', '0.0.0.0')}:{s.get('src_port', '0')}"
            dst = f"{s.get('dst_ip', '0.0.0.0')}:{s.get('dst_port', '0')}"
            tls_info = f"{s.get('tls_version', 'Plaintext')}<br/><font color='#64748b'>{s.get('cipher_suite', 'None')}</font>"
            cert_st = str(s.get("cert_status", "N/A"))
            
            sess_rows.append([
                Paragraph(f"<b>{proto}</b>", body_style),
                Paragraph(src, body_style),
                Paragraph(dst, body_style),
                Paragraph(tls_info, body_style),
                Paragraph(cert_st, body_style)
            ])

        sess_table = Table(sess_rows, colWidths=[54, 115, 115, 140, 80])
        sess_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#ffffff")),
        ]))
        story.append(sess_table)
        story.append(Spacer(1, 14))

    # Prioritized Findings Section
    story.append(Paragraph("3. Prioritized Forensic Vulnerabilities", section_h2))
    findings_rows = [
        [
            Paragraph("Severity", table_header_style),
            Paragraph("Finding & Description", table_header_style),
            Paragraph("Category", table_header_style),
            Paragraph("Standard Reference", table_header_style)
        ]
    ]
    
    if findings_data:
        for f in findings_data:
            sev = str(f.get("severity", "INFO")).upper()
            sev_color = SEV_COLORS.get(sev, colors.HexColor("#2563eb"))
            sev_p = Paragraph(f"<font color='{sev_color.hexval()}'><b>{sev}</b></font>", body_style)
            
            title_p = Paragraph(
                f"<b>{f.get('title', '')}</b><br/>"
                f"<font color='#64748b'>{f.get('description', '')}</font>",
                body_style
            )
            cat_p = Paragraph(str(f.get("category", "")), body_style)
            ref_p = Paragraph(f"<code>{f.get('standard_ref', '')}</code>", body_style)
            
            findings_rows.append([sev_p, title_p, cat_p, ref_p])
    else:
        findings_rows.append([
            Paragraph("-", body_style),
            Paragraph("No cryptographic vulnerabilities detected in analyzed network sessions.", body_style),
            Paragraph("-", body_style),
            Paragraph("-", body_style)
        ])

    findings_table = Table(findings_rows, colWidths=[70, 224, 90, 120])
    findings_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#ffffff")),
    ]))
    story.append(findings_table)
    story.append(Spacer(1, 14))

    # Recommendations Section
    if recommendations:
        story.append(Paragraph("3. Remediation Roadmap & Recommendations", section_h2))
        rec_rows = [
            [
                Paragraph("Priority", table_header_style),
                Paragraph("Recommended Action", table_header_style),
                Paragraph("Standard", table_header_style)
            ]
        ]
        for r in recommendations:
            prio = str(r.get("priority", "MEDIUM")).upper()
            prio_color = SEV_COLORS.get(prio, colors.HexColor("#2563eb"))
            
            prio_p = Paragraph(f"<font color='{prio_color.hexval()}'><b>{prio}</b></font>", body_style)
            rec_p = Paragraph(
                f"<b>{r.get('title', '')}</b><br/>"
                f"<font color='#475569'>{r.get('recommendation', '')}</font>",
                body_style
            )
            ref_p = Paragraph(f"<code>{r.get('standard_ref', '')}</code>", body_style)
            rec_rows.append([prio_p, rec_p, ref_p])

        rec_table = Table(rec_rows, colWidths=[70, 314, 120])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#ffffff")),
        ]))
        story.append(rec_table)

    # Build PDF using custom NumberedCanvas for header/footer
    doc.build(story, canvasmaker=NumberedCanvas)

    return {
        "json": str(json_path),
        "html": str(html_path),
        "pdf": str(pdf_path)
    }
