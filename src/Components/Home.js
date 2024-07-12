import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState('farmers'); // Default to farmers

    const apiKey = '6882af6f23bb43d8ad063948241007'; // Replace with your actual API key
    const weatherAPI = 'https://api.weatherapi.com/v1';
    const forecastAPI = `${weatherAPI}/forecast.json`;

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    setError('Failed to fetch current location. Please enter a city name.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser. Please enter a city name.');
        }
    };

    const fetchWeather = async (lat, lon) => {
        setLoading(true);
        setError('');
        try {
            const currentResponse = await axios.get(`${weatherAPI}/current.json`, {
                params: {
                    key: apiKey,
                    q: `${lat},${lon}`
                }
            });
            const forecastResponse = await axios.get(forecastAPI, {
                params: {
                    key: apiKey,
                    q: `${lat},${lon}`,
                    days: 7 // Number of days for forecast
                }
            });
            setWeatherData(currentResponse.data);
            setForecastData(forecastResponse.data);

            if (forecastResponse.data.forecast.forecastday.length > 0) {
                const currentHour = new Date().getHours();
                const todayForecast = forecastResponse.data.forecast.forecastday[0].hour;
                const hourlyData = todayForecast.filter(hour => new Date(hour.time).getHours() >= currentHour);
                setHourlyForecast(hourlyData);
            }
        } catch (error) {
            handleError(error);
        }
        setLoading(false);
    };

    const fetchWeatherByCity = async (cityName) => {
        setLoading(true);
        setError('');
        try {
            const currentResponse = await axios.get(`${weatherAPI}/current.json`, {
                params: {
                    key: apiKey,
                    q: cityName
                }
            });
            const forecastResponse = await axios.get(forecastAPI, {
                params: {
                    key: apiKey,
                    q: cityName,
                    days: 7 // Number of days for forecast
                }
            });
            setWeatherData(currentResponse.data);
            setForecastData(forecastResponse.data);
        } catch (error) {
            handleError(error);
        }
        setLoading(false);
    };

    const handleError = (error) => {
        if (error.response) {
            setError(`Failed to fetch weather data: ${error.response.data.error.message}`);
        } else if (error.request) {
            setError('Network error occurred. Please check your internet connection.');
        } else {
            setError('An error occurred. Please try again later.');
        }
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearch = () => {
        if (city.trim() !== '') {
            fetchWeatherByCity(city);
        } else {
            setError('Please enter a city name.');
        }
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
    };

    const prepareBarGraphData = () => {
        if (!forecastData) return [];
        return forecastData.forecast.forecastday.map(day => ({
            date: day.date,
            rain: day.day.totalprecip_mm,
            humidity: day.day.avghumidity,
            wind: day.day.maxwind_kph
        }));
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Weather Dashboard</h1>
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Enter city name"
                    className="city-input"
                />
                <button onClick={handleSearch} className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                <button onClick={fetchCurrentLocation} className="location-button" disabled={loading}>
                    Use Current Location
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="main-content">
                {weatherData && (
                    <div className="weather-info">
                        <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                        <div className="current-weather">
                            <div className="weather-detail">
                                <p>Current Temperature: {weatherData.current.temp_c}°C</p>
                                <p>Condition: {weatherData.current.condition.text}</p>
                                <img src={weatherData.current.condition.icon} alt="weather icon" />
                            </div>
                            <div className="air-conditions">
                                <p>Real Feel: {weatherData.current.feelslike_c}°C</p>
                                <p>Wind: {weatherData.current.wind_kph} kph</p>
                                <p>Clouds: {weatherData.current.cloud}%</p>
                                <p>Humidity: {weatherData.current.humidity}%</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* <div className="suggestion-container">
                    <div className={`suggestion ${selectedSuggestion === 'farmers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('farmers')}>
                        <h3>For Farmers</h3>
                    </div>
                    <div className={`suggestion ${selectedSuggestion === 'event_planners' ? 'active' : ''}`} onClick={() => handleSuggestionClick('event_planners')}>
                        <h3>For Event Planners</h3>
                    </div>
                    <div className={`suggestion ${selectedSuggestion === 'travelers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('travelers')}>
                        <h3>For Travelers</h3>
                    </div>
                </div> */}
            </div>
            {/* <div className="bar-container">
            <div className="suggestion-container">
                    <div className={`suggestion ${selectedSuggestion === 'farmers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('farmers')}>
                        <h3>For Farmers</h3>
                    </div>
                    <div className={`suggestion ${selectedSuggestion === 'event_planners' ? 'active' : ''}`} onClick={() => handleSuggestionClick('event_planners')}>
                        <h3>For Event Planners</h3>
                    </div>
                    <div className={`suggestion ${selectedSuggestion === 'travelers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('travelers')}>
                        <h3>For Travelers</h3>
                    </div>
                </div>
            {selectedSuggestion === 'farmers' && forecastData && (
                <div className="bar-chart-container">
                    <h3>Rain vs Humidity for Farmers</h3>
                    <BarChart width={600} height={300} data={prepareBarGraphData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rain" fill="#8884d8" />
                        <Bar dataKey="humidity" fill="#82ca9d" />
                    </BarChart>
                </div>
            )}
            {selectedSuggestion === 'event_planners' && forecastData && (
                <div className="bar-chart-container">
                    <h3>Rain vs Wind for Event Planners</h3>
                    <BarChart width={600} height={300} data={prepareBarGraphData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rain" fill="#8884d8" />
                        <Bar dataKey="wind" fill="#ffc658" />
                    </BarChart>
                </div>
            )}
            {selectedSuggestion === 'travelers' && forecastData && (
                <div className="bar-chart-container">
                    <h3>Rain vs Humidity vs Wind for Travelers</h3>
                    <BarChart width={600} height={300} data={prepareBarGraphData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rain" fill="#8884d8" />
                        <Bar dataKey="humidity" fill="#82ca9d" />
                        <Bar dataKey="wind" fill="#ffc658" />
                    </BarChart>
                </div>
            )}
            </div> */}
            <div className="bar-container">
    <div className="suggestion-container">
        <div className={`suggestion ${selectedSuggestion === 'farmers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('farmers')}>
            <h3>For Farmers</h3>
        </div>
        <div className={`suggestion ${selectedSuggestion === 'event_planners' ? 'active' : ''}`} onClick={() => handleSuggestionClick('event_planners')}>
            <h3>For Event Planners</h3>
        </div>
        <div className={`suggestion ${selectedSuggestion === 'travelers' ? 'active' : ''}`} onClick={() => handleSuggestionClick('travelers')}>
            <h3>For Travelers</h3>
        </div>
    </div>
    <div className="charts-container">
        {selectedSuggestion === 'farmers' && forecastData && (
            <div className="bar-chart-container">
                <h3>Rain vs Humidity for Farmers</h3>
                <br/>
                <h6>Plan According to Rain and Humidity</h6>
                <BarChart width={600} height={300} data={prepareBarGraphData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rain" fill="#8884d8" />
                    <Bar dataKey="humidity" fill="#82ca9d" />
                </BarChart>
            </div>
        )}
        {selectedSuggestion === 'event_planners' && forecastData && (
            <div className="bar-chart-container">
                <h3>Rain vs Wind for Event Planners</h3>
                <h6>Plan According to Rain and Wind</h6>
                <BarChart width={600} height={300} data={prepareBarGraphData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rain" fill="#8884d8" />
                    <Bar dataKey="wind" fill="#ffc658" />
                </BarChart>
            </div>
        )}
        {selectedSuggestion === 'travelers' && forecastData && (
            <div className="bar-chart-container">
                <h3>Rain vs Humidity vs Wind for Travelers</h3>
                <h6>Plan According to Rain,Humidity and Wind</h6>
                <BarChart width={600} height={300} data={prepareBarGraphData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rain" fill="#8884d8" />
                    <Bar dataKey="humidity" fill="#82ca9d" />
                    <Bar dataKey="wind" fill="#ffc658" />
                </BarChart>
            </div>
        )}
    </div>
</div>

            {forecastData && forecastData.forecast.forecastday[0].hour && (
                <div className="hourly-forecast">
                    <h3>Hourly Forecast for Today</h3>
                    <div className="hourly-forecast-items">
                        {forecastData.forecast.forecastday[0].hour
                            .filter(hour => new Date(hour.time).getHours() >= new Date().getHours())
                            .map((hour, index) => (
                                <div className="hourly-forecast-item" key={index}>
                                    <h4>{new Date(hour.time).getHours()}:00</h4>
                                    <p>Temp: {hour.temp_c}°C</p>
                                    <img src={hour.condition.icon} alt="weather icon" />
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {forecastData && (
                <div className="forecast">
                    <h3>Weekly Forecast</h3>
                    <div className="forecast-days">
                        {forecastData.forecast.forecastday.map((day, index) => (
                            <div className="forecast-day" key={index} onClick={() => handleDayClick(day)}>
                                <h4>{day.date}</h4>
                                <p>Max Temp: {day.day.maxtemp_c}°C</p>
                                <p>Min Temp: {day.day.mintemp_c}°C</p>
                                <p>Condition: {day.day.condition.text}</p>
                                <img src={day.day.condition.icon} alt="weather icon" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {selectedDay && (
                <div className="area-chart-container">
                    <h3>Temperature Throughout the Day</h3>
                    <AreaChart width={600} height={300} data={selectedDay.hour}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="temp_c" stroke="#4a0742" fill="#71bee5" />
                    </AreaChart>
                </div>
            )}
           
        </div>
    );
};

export default Home;
