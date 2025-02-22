import fetch from 'node-fetch';

async function getBarometerData(city) {
  const locations = {
    "Vilnius": { lat: 54.6872, lon: 25.2797 },
    "Nida": { lat: 55.3035, lon: 21.0052 },
  };

  if (!locations[city]) {
    throw new Error("City not supported");
  }

  const { lat, lon } = locations[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=pressure_msl`;

  try {
    const [weather, barometer] = await Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url1).then(res => res.json())
    ]);
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
