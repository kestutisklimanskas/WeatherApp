import fetch from 'node-fetch';

async function getBarometerData(city) {
  //coordinates of cities
  const locations = {
    "Vilnius": { lat: 54.6872, lon: 25.2797 },
    "Nida": { lat: 55.3035, lon: 21.0052 },
  };
  //check if city is supported
  if (!locations[city]) {
    throw new Error("City not supported");
  }
  //fetching data from free API - weather and pressure
  const { lat, lon } = locations[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=pressure_msl`;

  try {
    //fetching data from two endpoints at once
    const [weather, barometer] = await Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url1).then(res => res.json())
    ]);
    //setting the data to return
    const data = {
      weather: weather.current_weather,
      barometer: barometer.current.pressure_msl
    };
    return data;
  } catch (error) {
    console.error("Error fetching barometer data:", error);
    throw new Error("Unable to retrieve data");
  }
}

export default getBarometerData;
