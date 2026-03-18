from datetime import datetime
from .. import db
import uuid


class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    issued_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    certificate_url = db.Column(db.String(255))
    qr_code_url = db.Column(db.String(255))
    is_verified = db.Column(db.Boolean, default=True)

    issued_at = db.Column(db.DateTime, default=datetime.utcnow)

    issuer = db.relationship("User", foreign_keys=[issued_by])

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "student_id": self.student_id,
            "title": self.title,
            "description": self.description,
            "certificate_url": self.certificate_url,
            "qr_code_url": self.qr_code_url,
            "is_verified": self.is_verified,
            "issued_by": self.issuer.name if self.issuer else None,
            "issued_at": self.issued_at.isoformat(),
        }
