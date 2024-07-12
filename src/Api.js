import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const TravelersDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with your weather API endpoint
                const response = await axios.get('https://api.weatherapi.com/v1/forecast.json?key=6882af6f23bb43d8ad063948241007&q=London&days=1');

                // Assuming the API response has a structure with forecast data
                if (response.data && response.data.forecast) {
                    setWeatherData(response.data.forecast.forecastday[0].hour); // Adjust data structure as per API response
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run effect only once on component mount

    return (
        <div className="travelers-dashboard">
            <h2>Weather Forecast for Travelers</h2>
            {weatherData.length > 0 && (
                <>
                    <div className="weather-description">
                        <h3>Today's Weather Overview</h3>
                        <p>Temperature: {weatherData[0].temp_c}°C</p>
                        <p>Condition: {weatherData[0].condition.text}</p>
                    </div>
                    <div className="weather-chart">
                        <h3>Temperature Throughout the Day</h3>
                        <LineChart width={600} height={300} data={weatherData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="temp_c" stroke="#8884d8" />
                        </LineChart>
                    </div>
                </>
            )}
        </div>
    );
};

export default TravelersDashboard;
