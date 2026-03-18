import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=[app.config["FRONTEND_URL"]])

    # Ensure upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.achievements import achievements_bp
    from .routes.goals import goals_bp
    from .routes.emotions import emotions_bp
    from .routes.certificates import certificates_bp
    from .routes.admin import admin_bp
    from .routes.passport import passport_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(achievements_bp, url_prefix="/api/achievements")
    app.register_blueprint(goals_bp, url_prefix="/api/goals")
    app.register_blueprint(emotions_bp, url_prefix="/api/emotions")
    app.register_blueprint(certificates_bp, url_prefix="/api/certificates")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(passport_bp, url_prefix="/api/passport")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Happiness Passport API is running"}

    return app
