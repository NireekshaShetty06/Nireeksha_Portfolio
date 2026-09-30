from flask import Flask, render_template, request, jsonify
import subprocess
import os

app = Flask(__name__)

# Uses crime.exe on Windows, ./crime on linux/mac
CPP_EXEC = "crime.exe" if os.name == 'nt' else "./crime"

def run_cpp(args):
    try:
        # Run the C++ executable with the given arguments
        # Use shell=True on windows to find the exe easily in the current dir
        result = subprocess.run([CPP_EXEC] + args, capture_output=True, text=True)
        return result.stdout.strip()
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/add', methods=['POST'])
def add_criminal():
    data = request.json
    output = run_cpp(['add', data['id'], data['name'], data['age'], data['crimeType'], data['status']])
    return jsonify({"message": output})

@app.route('/api/display', methods=['GET'])
def display_criminals():
    output = run_cpp(['display'])
    if output.startswith("Error") or not output:
        return jsonify([])
    
    records = []
    for line in output.split('\n'):
        if line.strip():
            parts = line.split(',')
            if len(parts) == 5:
                records.append({
                    "id": parts[0],
                    "name": parts[1],
                    "age": parts[2],
                    "crimeType": parts[3],
                    "status": parts[4]
                })
    return jsonify(records)

@app.route('/api/search', methods=['POST'])
def search_criminal():
    data = request.json
    output = run_cpp(['search', data['searchTerm']])
    if output.startswith("Error") or not output:
        return jsonify({"error": output})
    
    records = []
    for line in output.split('\n'):
        if line.strip():
            parts = line.split(',')
            if len(parts) == 5:
                records.append({
                    "id": parts[0],
                    "name": parts[1],
                    "age": parts[2],
                    "crimeType": parts[3],
                    "status": parts[4]
                })
    return jsonify(records)

@app.route('/api/delete', methods=['POST'])
def delete_criminal():
    data = request.json
    output = run_cpp(['delete', data['id']])
    return jsonify({"message": output})
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username == "admin" and password == "admin":
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})


    if username == "admin" and password == "admin":
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
