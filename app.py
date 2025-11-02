from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/navdata", methods=["POST"])
def navdata():
    data = request.get_json(silent=True) or {}
    print(f"[{datetime.now():%H:%M:%S}] Received navigation data: {data}")
    return jsonify(status="received"), 200

if __name__ == "__main__":
    # Option A: HTTP (works on desktop, but iOS geolocation likely blocked)
    # app.run(host="0.0.0.0", port=5000)

    # Option B: HTTPS (recommended for iPhone Safari). 
    # 'adhoc' creates a self-signed cert—iOS may not trust it by default.
    # Works great if you trust the cert or use a tool like 'mkcert' or 'ngrok'.
    app.run(host="0.0.0.0", port=5000, ssl_context="adhoc")
``