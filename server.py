from flask import Flask, request

app = Flask(__name__)

@app.route('/navdata', methods=['POST'])
def navdata():
    data = request.json
    print("Received navigation data:", data)
    return {"status": "received"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)