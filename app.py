from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# File to store statuses
STATUS_FILE = "statuses.json"

# Load or initialize statuses
def load_statuses():
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, "r") as file:
            return json.load(file)
    return {"current": "Welcome to the lab!", "options": ["Welcome to the lab!"]}

def save_statuses(statuses):
    with open(STATUS_FILE, "w") as file:
        json.dump(statuses, file)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_status", methods=["GET"])
def get_status():
    statuses = load_statuses()
    return jsonify(statuses)

@app.route("/update_status", methods=["POST"])
def update_status():
    data = request.json
    statuses = load_statuses()
    if "status" in data:
        statuses["current"] = data["status"]
        save_statuses(statuses)
        return jsonify({"message": "Status updated successfully!"}), 200
    return jsonify({"error": "Invalid data"}), 400

@app.route("/add_status", methods=["POST"])
def add_status():
    data = request.json
    statuses = load_statuses()
    if "status" in data and data["status"] not in statuses["options"]:
        statuses["options"].append(data["status"])
        save_statuses(statuses)
        return jsonify({"message": "Status added successfully!"}), 200
    return jsonify({"error": "Status already exists or invalid"}), 400

@app.route("/delete_status", methods=["POST"])
def delete_status():
    data = request.json
    statuses = load_statuses()
    if "status" in data and data["status"] in statuses["options"]:
        statuses["options"].remove(data["status"])
        save_statuses(statuses)
        return jsonify({"message": "Status deleted successfully!"}), 200
    return jsonify({"error": "Status not found"}), 400

if __name__ == "__main__":
    app.run(debug=True)
