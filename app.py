import os
from flask import Flask, send_from_directory, request
from flask_cors import CORS
from models import db
from routes.users import users_bp
from routes.challenges import challenges_bp
from routes.trades import trades_bp
from routes.real_time_data import real_time_data_bp
from routes.ai_signals import ai_signals_bp


def create_app():
    app = Flask(__name__, static_folder='frontend/build/static', static_url_path='/static')
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
    
    # Serve React App (catch-all route)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path=''):
        build_folder = os.path.join(os.path.dirname(__file__), 'frontend', 'build')
        
        # Handle API routes separately
        if path.startswith('api/') or path.startswith('users/') or path.startswith('challenges/') or path.startswith('trades/') or path.startswith('real_time_data/') or path.startswith('ai_signals/') or path.startswith('auth/'):
            # Return 404 so Flask's API routes can handle them
            return {"error": "API route not found"}, 404
        
        # Serve static files
        if path.startswith('static/'):
            static_folder = os.path.join(build_folder, path)
            if os.path.exists(static_folder):
                return send_from_directory(build_folder, path)
        elif path != "" and os.path.exists(os.path.join(build_folder, path)):
            return send_from_directory(build_folder, path)
        else:
            return send_from_directory(build_folder, 'index.html')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app


# Create the app instance for Gunicorn
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use PORT environment variable or default to 5000
    app.run(host='0.0.0.0', port=port, debug=False)