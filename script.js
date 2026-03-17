
        const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const weatherInfo = document.getElementById('weatherInfo');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');

        // Demo data for demonstration when API key is not available
        const demoData = {
            'london': {
                name: 'London',
                main: { temp: 15, feels_like: 14, humidity: 72, pressure: 1013 },
                weather: [{ description: 'scattered clouds', main: 'Clouds' }],
                wind: { speed: 4.5 }
            },
            'new york': {
                name: 'New York',
                main: { temp: 20, feels_like: 19, humidity: 65, pressure: 1015 },
                weather: [{ description: 'clear sky', main: 'Clear' }],
                wind: { speed: 3.2 }
            },
            'tokyo': {
                name: 'Tokyo',
                main: { temp: 22, feels_like: 21, humidity: 70, pressure: 1012 },
                weather: [{ description: 'light rain', main: 'Rain' }],
                wind: { speed: 2.8 }
            }
        };

        function getWeatherIcon(weatherMain) {
            const icons = {
                'Clear': '☀️',
                'Clouds': '☁️',
                'Rain': '🌧️',
                'Drizzle': '🌦️',
                'Thunderstorm': '⛈️',
                'Snow': '❄️',
                'Mist': '🌫️',
                'Smoke': '💨',
                'Haze': '🌫️',
                'Fog': '🌫️'
            };
            return icons[weatherMain] || '🌤️';
        }

        function displayWeather(data) {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('weatherIcon').textContent = getWeatherIcon(data.weather[0].main);
            document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

            loading.classList.remove('active');
            weatherInfo.classList.add('active');
        }

        async function getWeather(city) {
            try {
                error.classList.remove('active');
                weatherInfo.classList.remove('active');
                loading.classList.add('active');

                // Check if using demo data
                if (API_KEY === 'YOUR_API_KEY') {
                    const cityLower = city.toLowerCase();
                    if (demoData[cityLower]) {
                        setTimeout(() => displayWeather(demoData[cityLower]), 500);
                        return;
                    } else {
                        throw new Error('Demo mode: Please try "London", "New York", or "Tokyo". Or add your API key!');
                    }
                }

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error('City not found');
                }

                const data = await response.json();
                displayWeather(data);

            } catch (err) {
                loading.classList.remove('active');
                error.textContent = err.message;
                error.classList.add('active');
            }
        }

        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        });

        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = cityInput.value.trim();
                if (city) {
                    getWeather(city);
                }
            }
        });

        // Load default city on page load
        getWeather('London');
