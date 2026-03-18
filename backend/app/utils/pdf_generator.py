import os
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm


def generate_certificate_pdf(cert, student, issuer, output_dir: str = "uploads/certificates") -> str:
    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, f"{cert.uuid}.pdf")

    doc = SimpleDocTemplate(path, pagesize=landscape(A4), topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle("Title", parent=styles["Title"], fontSize=28, textColor=colors.HexColor("#1a365d"), spaceAfter=12)
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=14, textColor=colors.HexColor("#2d3748"), alignment=1, spaceAfter=8)
    name_style = ParagraphStyle("Name", parent=styles["Normal"], fontSize=24, textColor=colors.HexColor("#2b6cb0"), alignment=1, fontName="Helvetica-Bold", spaceAfter=12)

    story = [
        Spacer(1, 1*cm),
        Paragraph("HAPPINESS PASSPORT", title_style),
        Paragraph("Certificate of Achievement", ParagraphStyle("Sub", parent=styles["Normal"], fontSize=16, textColor=colors.HexColor("#718096"), alignment=1)),
        Spacer(1, 1*cm),
        Paragraph("This is to certify that", body_style),
        Paragraph(student.name, name_style),
        Paragraph(f"has successfully {cert.description or 'participated in'}", body_style),
        Paragraph(f"<b>{cert.title}</b>", ParagraphStyle("Bold", parent=body_style, fontSize=18, textColor=colors.HexColor("#1a365d"), fontName="Helvetica-Bold")),
        Spacer(1, 1*cm),
        Paragraph(f"Issued by: {issuer.name}", body_style),
        Paragraph(f"Verification ID: {cert.uuid}", ParagraphStyle("Small", parent=styles["Normal"], fontSize=9, textColor=colors.gray, alignment=1)),
    ]

    doc.build(story)
    return f"/uploads/certificates/{cert.uuid}.pdf"
