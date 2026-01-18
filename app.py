import os
from flask import Flask, send_from_directory, request, redirect
from flask_cors import CORS
from models import db
from routes.users import users_bp
from routes.challenges import challenges_bp
from routes.trades import trades_bp
from routes.real_time_data import real_time_data_bp
from routes.ai_signals import ai_signals_bp


def create_app():
    # Specify instance path to avoid read-only filesystem issues in serverless environments
    instance_path = os.environ.get('INSTANCE_PATH', '/tmp') if os.environ.get('SERVERLESS_ENV') else None
    app = Flask(__name__, static_folder='frontend/build/static', static_url_path='/static', instance_path=instance_path)
    # Use PostgreSQL in production, SQLite in development
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///tradesense.db'
    # Remove 'postgres://' prefix if present (for compatibility with newer Heroku)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

    # Initialize extensions
    db.init_app(app)
    # Configure CORS - allow all origins during development, restrict in production
    cors_origins = os.environ.get('CORS_ORIGINS', '*')
    CORS(app, resources={r"/*": {"origins": cors_origins}}, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(challenges_bp)
    app.register_blueprint(trades_bp)
    app.register_blueprint(real_time_data_bp)
    app.register_blueprint(ai_signals_bp)
    
    # Simple API health check
    @app.route('/api/health')
    def health_check():
        return {"message": "TradeSense API is running", "status": "success"}
    
    # Root route for API server
    @app.route('/')
    def root():
        return {"message": "TradeSense API is running", "status": "success"}
    
    # Serve React App (handles other paths)
    @app.route('/<path:path>')
    def serve_react_app(path):
        build_folder = os.path.join(os.path.dirname(__file__), 'frontend', 'build')
        
        # Serve static files
        if path.startswith('static/'):
            return send_from_directory(build_folder, path)
        elif path == "":
            return send_from_directory(build_folder, 'index.html')
        elif os.path.exists(os.path.join(build_folder, path)):
            return send_from_directory(build_folder, path)
        else:
            return send_from_directory(build_folder, 'index.html')
    
    # Only create tables in development mode
    if not os.environ.get('SERVERLESS_ENV'):
        with app.app_context():
            db.create_all()
    
    return app


# Create the app instance for Gunicorn
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use PORT environment variable or default to 5000
    app.run(host='0.0.0.0', port=port, debug=False)