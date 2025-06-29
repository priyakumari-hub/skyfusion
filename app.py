from flask import Flask,request,jsonify,render_template
import requests,os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime,timedelta

# Load API keys from .env


load_dotenv()

app=Flask(__name__)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
NASA_API_KEY = os.getenv("NASA_API_KEY")



@app.route("/")
def index():
    return render_template("main.html")  

@app.route("/weather_page")
def weather_page():
    return render_template("weather.html")

@app.route('/space_page')
def space_page():
    event_types = {
        "CME (Coronal Mass Ejection)": "CME",
        "GST (Geomagnetic Storm)": "GST",
        "FLR (Solar Flare)": "FLR",
        "SEP (Solar Energetic Particle)": "SEP",
        "notifications": "notifications"
    }
    default_end = datetime.utcnow().date()
    default_start = default_end - timedelta(days=30)
    return render_template("space.html",
                           event_types=event_types,
                           default_start_date=default_start.strftime("%Y-%m-%d"),
                           default_end_date=default_end.strftime("%Y-%m-%d"),
                           event_descriptions=event_descriptions)


@app.route("/apod_page")
def apod_page():
    return render_template("apod.html")

@app.route("/disaster_page")
def disaster_page():
    return render_template("disaster.html")


@app.route("/weather")
def get_weather():
    city=request.args.get("city")
    if not city:
        return jsonify({"error":"City name is required"}),400
    url=f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response=requests.get(url)
    if response.status_code!=200:
        return jsonify({"error":"City not found"}),404
    data=response.json()
    return jsonify({
        "city":data["name"],
        "temperature":data["main"]["temp"],
        "condition":data["weather"][0]["description"]
})

#space weather

@app.route("/space-alert")
def space_alert():
    try:
        url = "https://services.swpc.noaa.gov/products/alerts.json"
        response = requests.get(url, timeout=5)
        data = response.json()

        if len(data) <= 1:
            return jsonify({"status": "none"})  # No space event currently

        headers = data[0]
        latest = data[-1]
        alert = dict(zip(headers, latest))

        return jsonify({
            "status": "active",
            "message_type": alert.get("Message Type", "Unknown"),
            "message_code": alert.get("Message Code", "Unknown"),
            "issue_time": alert.get("Issue Time", "Unknown"),
            "message_body": alert.get("Message Body", "")
        })

    except Exception as e:
        print("Error fetching space weather:", e)
        return jsonify({"status": "error", "message": str(e)})





event_descriptions = {
        "CME": "Coronal Mass Ejection (CME): A massive burst of solar wind and magnetic fields rising above the solar corona.",  # Description for CME (Commented by Agnirva.com)
    "GST": "Geomagnetic Storm (GST): Disturbances in Earth's magnetosphere caused by solar wind shocks.",  # Description for GST (Commented by Agnirva.com)
    "FLR": "Solar Flare (FLR): A sudden flash of increased brightness on the Sun, usually observed near its surface.",  # Description for FLR (Commented by Agnirva.com)
    "SEP": "Solar Energetic Particle (SEP): High-energy particles emitted by the Sun, often associated with solar flares and CMEs.",  # Description for SEP (Commented by Agnirva.com)
    "IPS": "Interplanetary Shock (IPS): Shock waves traveling through space, often caused by CMEs or solar wind variations.",  # Description for IPS (Commented by Agnirva.com)
    "RBE": "Radiation Belt Enhancement (RBE): An increase in the density of charged particles in Earth's radiation belts.",  # Description for RBE (Commented by Agnirva.com)
    "MPC": "Magnetopause Crossing (MPC): When solar wind plasma crosses Earth's magnetopause, the boundary of the magnetosphere.",  # Description for MPC (Commented by Agnirva.com)
    "HSS": "High Speed Stream (HSS): Streams of fast-moving solar wind emanating from coronal holes on the Sun.",  # Description for HSS (Commented by Agnirva.com)
    "notifications": "Notifications: General alerts and updates related to various space weather events."  # Description for notifications (Commented by Agnirva.com)
}

# Fetch function
def fetch_space_weather(event, start, end, key):
    base_url = f"https://api.nasa.gov/DONKI/{event}"
    params = {
        "startDate": start.strftime("%Y-%m-%d"),
        "endDate": end.strftime("%Y-%m-%d"),
        "api_key": key
    }
    try:
        res = requests.get(base_url, params=params)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        print("API fetch error:", e)
        return None


@app.route('/fetch_data', methods=['POST'])
def fetch_data():
    data = request.get_json()
    event = data.get('eventType')
    start_date = datetime.strptime(data.get('startDate'), "%Y-%m-%d")
    end_date = datetime.strptime(data.get('endDate'), "%Y-%m-%d")

    # ✅ Use predefined API key
    raw_data = fetch_space_weather(event, start_date, end_date, NASA_API_KEY)
    if not raw_data:
        return jsonify({"error": "No data found or API error"}), 500

    # Normalize data
    df = pd.json_normalize(raw_data)
    date_col = next((c for c in df.columns if 'Time' in c or 'date' in c.lower()), None)
    if date_col:
        df['date'] = pd.to_datetime(df[date_col], errors='coerce').dt.date
        df = df.dropna(subset=['date'])
        grouped = df.groupby('date').size().reset_index(name='count')
        plot_data = grouped.to_dict(orient='records')
    else:
        plot_data = []

    return jsonify({
        "success": True,
        "plot_data": plot_data,
        "event_description": event_descriptions.get(event, "No description."),
        "raw_json": raw_data
    })



#apod

@app.route("/apod")
def get_apod():
    date = request.args.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    url = f"https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}&date={date}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#disasters
 
@app.route('/disasters')
def get_disasters():
    dtype = request.args.get("type", "")
    days = int(request.args.get("days", 7))
    start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    url = f"https://eonet.gsfc.nasa.gov/api/v3/events?category={dtype}&start={start}&status=all&api_key={NASA_API_KEY}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    


if __name__=="__main__":
    app.run(debug=True)




