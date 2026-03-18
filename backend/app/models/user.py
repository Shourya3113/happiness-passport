from datetime import datetime
from .. import db
import bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum("student", "faculty", "admin", name="user_role"), nullable=False, default="student")
    department = db.Column(db.String(100))
    student_id = db.Column(db.String(50), unique=True)
    avatar_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    achievements = db.relationship("Achievement", foreign_keys="Achievement.student_id", backref="student", lazy="dynamic")
    goals = db.relationship("Goal", backref="student", lazy="dynamic")
    emotion_logs = db.relationship("EmotionLog", backref="student", lazy="dynamic")
    certificates = db.relationship("Certificate", foreign_keys="Certificate.student_id", backref="student", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "student_id": self.student_id,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at.isoformat(),
        }
