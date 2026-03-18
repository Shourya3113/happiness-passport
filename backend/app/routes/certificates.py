from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models.certificate import Certificate
from ..models.user import User
from ..utils.pdf_generator import generate_certificate_pdf
from ..utils.qr_generator import generate_qr_code
from .. import db

certificates_bp = Blueprint("certificates", __name__)


@certificates_bp.route("/", methods=["GET"])
@jwt_required()
def list_certificates():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role == "student":
        certs = Certificate.query.filter_by(student_id=user_id).all()
    elif role == "faculty":
        certs = Certificate.query.filter_by(issued_by=user_id).all()
    else:
        certs = Certificate.query.all()
    return jsonify([c.to_dict() for c in certs])


@certificates_bp.route("/issue", methods=["POST"])
@jwt_required()
def issue_certificate():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role not in ("faculty", "admin"):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    student = User.query.get(data.get("student_id"))
    if not student or student.role != "student":
        return jsonify({"error": "Invalid student"}), 400

    cert = Certificate(
        student_id=student.id,
        issued_by=user_id,
        event_id=data.get("event_id"),
        title=data["title"],
        description=data.get("description"),
    )
    db.session.add(cert)
    db.session.flush()

    verify_url = f"/api/certificates/verify/{cert.uuid}"
    qr_path = generate_qr_code(cert.uuid, verify_url)
    cert.qr_code_url = qr_path

    issuer = User.query.get(user_id)
    pdf_path = generate_certificate_pdf(cert, student, issuer)
    cert.certificate_url = pdf_path

    db.session.commit()
    return jsonify(cert.to_dict()), 201


@certificates_bp.route("/verify/<uuid>", methods=["GET"])
def verify_certificate(uuid):
    cert = Certificate.query.filter_by(uuid=uuid).first_or_404()
    student = User.query.get(cert.student_id)
    return jsonify({
        "valid": True,
        "certificate": cert.to_dict(),
        "student": {"name": student.name, "student_id": student.student_id},
    })