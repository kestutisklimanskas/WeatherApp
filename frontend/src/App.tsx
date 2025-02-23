import { useState, useEffect, use } from "react";
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faThermometerHalf, faWind, faCompass, faClock } from '@fortawesome/free-solid-svg-icons';

//created an object to store the weather data from API call
interface weatherData {
  interval: number;
  temperature: number;
  is_day: number;
  weathercode: number;
  time: string;
  winddirection: number;
  windspeed: number;
}
function App() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [weather, setWeather] = useState<weatherData>({
    interval: 0,
    temperature: 0,
    is_day: 0,
    weathercode: 0,
    time: new Date().toISOString(),
    winddirection: 0,
    windspeed: 0,
  });
  const [isRising, setRising] = useState<string>("");
  const [pressureVilnius, setPressureVilnius] = useState<number>(1);
  const [pressureNida, setPressureNida] = useState<number>(1);

  const fetchBarometerData = async (city: string) => {
    try {
      //saving the selected city for displaying data
      setSelectedCity(city);
      //fetching to backend
      const res = await fetch(`http://localhost:5000/api/barometer/${city}`);
      //if response is not ok, throw an error
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      //parsing the response to json
      const data = await res.json();
      //if city is Vilnius, set the pressureVilnius to the data received from API
      //if city is Nida, set the pressureNida to the data received from API
      if (city === "Vilnius") {
        if (pressureVilnius != data.body.barometer) {
          //saving pressure only if it is different than previous data
          setPressureVilnius(data.body.barometer);
        }
        //comparing, whether previous pressure is greater than 1 and current pressure is greater than previous pressure
        //if true, set the rising to "Rising"
        //if false, set the rising to "Falling"
        //if both are equal, set the rising to "Stable"
        pressureVilnius > 1 && data.body.barometer > pressureVilnius ? setRising("Rising") :
          data.body.barometer < pressureVilnius ? setRising("Falling") : setRising("Stable");
      }
      else if (city === "Nida") {
        if (pressureNida != data.body.barometer) {
          setPressureNida(data.body.barometer);
        }
        pressureNida > 1 && data.body.barometer > pressureNida ? setRising("Rising") :
          data.body.barometer < pressureNida ? setRising("Falling") : setRising("Stable");
      }
      //setting the weather data to the data received from API
      setWeather(data.body.weather);
    } catch (error) {
      console.error("Error:", error);
      //if there is an error, set the pressure to 0
      city === "Vilnius" ? setPressureVilnius(0) : setPressureNida(0);
    }
  };

  //useEffect hook to fetch the data from API on initial render
  useEffect(() => {
    fetchBarometerData("Vilnius");
    fetchBarometerData("Nida");
  }, []);

  //function to get the rotation of the arrow based on the
  //pressure received from API
  const getRotation = (pressure: number) => {
    const minPressure = 950;
    const maxPressure = 1050;
    const minRotation = -45;
    const maxRotation = 45;
    const rotation = ((pressure - minPressure) / (maxPressure - minPressure)) * (maxRotation - minRotation) + minRotation;
    return rotation;
  };

  //function to get the weather icon based on the weather code received from API according to WMO weather code
  // and appropriate description
  const getWeatherIconUrl = (weatherCode: number) => {
    const iconMap: { [key: number]: { icon: string, description: string } } = {
      0: { icon: "01d", description: "Clear sky" },
      1: { icon: "02d", description: "Mainly clear" },
      2: { icon: "03d", description: "Partly cloudy" },
      3: { icon: "04d", description: "Overcast" },
      45: { icon: "50d", description: "Fog" },
      48: { icon: "50d", description: "Depositing rime fog" },
      51: { icon: "09d", description: "Drizzle: Light" },
      53: { icon: "09d", description: "Drizzle: Moderate" },
      55: { icon: "09d", description: "Drizzle: Dense intensity" },
      56: { icon: "09d", description: "Freezing Drizzle: Light" },
      57: { icon: "09d", description: "Freezing Drizzle: Dense intensity" },
      61: { icon: "10d", description: "Rain: Slight" },
      63: { icon: "10d", description: "Rain: Moderate" },
      65: { icon: "10d", description: "Rain: Heavy intensity" },
      66: { icon: "13d", description: "Freezing Rain: Light" },
      67: { icon: "13d", description: "Freezing Rain: Heavy intensity" },
      71: { icon: "13d", description: "Snow fall: Slight" },
      73: { icon: "13d", description: "Snow fall: Moderate" },
      75: { icon: "13d", description: "Snow fall: Heavy intensity" },
      77: { icon: "13d", description: "Snow grains" },
      80: { icon: "09d", description: "Rain showers: Slight" },
      81: { icon: "09d", description: "Rain showers: Moderate" },
      82: { icon: "09d", description: "Rain showers: Violent" },
      85: { icon: "13d", description: "Snow showers slight" },
      86: { icon: "13d", description: "Snow showers heavy" },
      95: { icon: "11d", description: "Thunderstorm: Slight or moderate" },
      96: { icon: "11d", description: "Thunderstorm with slight hail" },
      99: { icon: "11d", description: "Thunderstorm with heavy hail" }
    };
    //if not weather code is not present - default to clear sky
    const { icon, description } = iconMap[weatherCode] || { icon: "01d", description: "Clear sky" };
    return { url: `http://openweathermap.org/img/wn/${icon}.png`, description };
  };
  //getting the weather icon url and description from received weather code
  const { url: weatherIconUrl, description: weatherDescription } = getWeatherIconUrl(weather.weathercode);

  //function to render the steps of the barometer
  const renderSteps = () => {
    const steps = [];
    const minPressure = 950;
    const maxPressure = 1050;
    const stepCount = 5;
    const startAngle = 180;
    const endAngle = 0;
    const radius = 62;

    for (let i = 0; i <= stepCount; i++) {
      const angleDeg = startAngle + (i * (endAngle - startAngle) / stepCount);
      const angleRad = angleDeg * (Math.PI / 180);
      const x = radius * Math.cos(angleRad);
      const y = radius * Math.sin(angleRad);
      steps.push(
        <div
          key={`label-${i}`}
          className="step-label"
          style={{
            position: "absolute",
            left: `calc(50% + ${(x * 1.3)}px)`,
            top: `calc(50% - ${(y * 1.2)}px)`,
            transform: `translate(-50%, -50%)`,
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {Math.round(minPressure + i * ((maxPressure - minPressure) / stepCount))}
        </div>
      );
    }
    return steps;
  };


  return (
    <div className="App">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h1 className="text-white">Weather and Pressure Information</h1>
        <div className="card d-flex justify-content-center align-items-center flex-column" style={{ padding: '0px', borderRadius: '12px' }}>
          <div className="card-body">
            <div className="d-flex justify-content-center align-items-center flex-row">
              <div className="city-box-vilnius mr-2" onClick={() => fetchBarometerData("Vilnius")}>
                <span className="city-text">Vilnius</span>
              </div>
              <div className="city-box-nida" onClick={() => fetchBarometerData("Nida")}> <span className="city-text">Nida</span></div>
            </div>
            {isRising && selectedCity && (
              <>
                <h4 className="mt-3">{selectedCity}</h4>
                <h5 className="mt-3">Weather</h5>
                <div className="d-flex flex-row justify-content-around mt-2 align-items-center">
                  <div><img src={weatherIconUrl} className="weather-icon mt-2" alt="Weather Icon" style={{ background: '#D3D3D3', borderRadius: '10px' }} />
                    <p className="card-text">{weatherDescription}</p></div>
                  <div className="d-flex justify-content-center flex-column align-items-start">
                    <p className="card-text"><FontAwesomeIcon icon={faTemperatureHigh} /> Temperature: {weather.temperature}°C</p>
                    <p className="card-text"><FontAwesomeIcon icon={faWind} /> Wind Speed: {weather.windspeed} m/s</p>
                    <p className="card-text"><FontAwesomeIcon icon={faCompass} /> Wind Direction: {weather.winddirection}°</p>
                    <p className="card-text"> <FontAwesomeIcon icon={faClock} /> Time: {new Date(weather.time).toLocaleString("lt-LT", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}</p>
                  </div>

                </div>

                <h5 className="mt-3">Pressure</h5>
                <div>
                  {isRising && selectedCity && (
                    <div className="barometer">
                      {renderSteps()}
                      <div
                        className="arrow"
                        style={{ transform: `rotate(${getRotation(selectedCity === "Vilnius" ? pressureVilnius : pressureNida)}deg)` }}
                      ></div>
                    </div>)
                  }
                  <div>
                    {isRising && selectedCity && (
                      <>
                        <h5>Pressure: {selectedCity === "Vilnius" ? pressureVilnius : pressureNida} hPa</h5>
                        <h5>Pressure is {isRising}</h5>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <br></br>
    </div >

  );
}

export default App;
