**SKY FUSION**

SKY FUSION is an interactive, multi-feature web application that integrates real-time weather, space weather alerts, natural disaster monitoring, and NASA's Astronomy Picture of the Day (APOD) — all in one place. It offers users global insights through a visually dynamic, informative, and user-friendly dashboard.

**Project Description**

This project was built with the aim of creating a centralized platform where users can explore:
     •	Local weather forecasts
     •	Active space weather phenomena (like solar flares or geomagnetic storms)
     •	Ongoing natural disasters across the globe
     •	Daily featured space imagery and data from NASA

**FILE STRUCTURE**

sky-fusion/
├── app.py
├── .gitignore
├── templates/
│   ├── main.html
│   ├── disaster.html
|   ├── apod.html
|   ├── space.html
|   ├── weather.html
├── static/
│   ├── css/
│   ├── js/
|   ├── images/
    

**Features**

     •	Weather Info :  Get current weather by entering your city
     •	Space Weather :  View solar events, flares, and magnetosphere data with visual alerts
     •	Natural Disasters  :  See real-time earthquakes, volcanic activity, wildfires, and more
     •	NASA APOD :  Daily space photo with a scientific description
     •	Clean UI/UX  : Each module has a themed page for clarity and engagement
     •	Modular Navigation  : Easily switch between features with one click

**DEMO VIDEO LINK**
   CLICK HERE TO VIEW : 
    https://drive.google.com/drive/folders/1qNv-Faae4kaQ12CW6E_r2_rcrQyor6g0

**Technologies Used**

•	Frontend : HTML, CSS, JavaScript
•	Backend : Python with Flask
•	APIs Used:
     OpenWeatherMap API
     NASA APOD API
     NOAA SWPC (for space weather)
     EONET (for natural disasters)

**Project Structure**

Day 1 : Set up Flask backend, built weather and APOD modules
Day 2: Added space weather and disaster modules with APIs
Day 3: Integrated all pages, designed frontend UI
Day 4: Tested APIs, prepared deployment 
Day 5: Documentation & demo video

**Challenges FACED & Solutions**

Challenge  
    •	Integrating multiple APIs with different response formats
    •	 Real-time data rendering in JS & Flask
    •	 Cross-origin data fetch errors 
    •	Making deployment-ready Flask app setup 

Solutions which applied
    •	  Wrote custom parsers and error handling logic    
    •	Used asynchronous fetch and Flask routes properly  
    •	  Configured CORS and structured APIs to respond correctly  
    •	  Used proper folder structure and Render-compatible

**SETUP AND USAGE INFORMATION**

 Follow the steps below to set up and run the SKY FUSION application on your local system.

	 • Requirements
 
       •	Python 3.7 or higher
       •	Python Flask from library
       •	Git installed
       •	Internet connection (for live API calls)
       •	A code editor (like VS Code) is recommended


  • Clone the Repository
      Open your terminal or command prompt and run:
      ```bash
        git clone https://github.com/priyakumari-hub/skyfusion

  • Run the Flask Application
       Start the application with: python app.py
       Your terminal will show output like:
       * Running on http://127.0.0


