from flask import Blueprint, request, jsonify, render_template
from app.generator import generate_password

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    try:
        password = generate_password(
            secret = data['secret'],
            service = data['service'],
            length = int(data.get('length', 32)),
            version = int(data.get('version', 1))
        )
        return jsonify({"password": password})
    except Exception as ex:
        return jsonify({"error": str(ex)}), 400