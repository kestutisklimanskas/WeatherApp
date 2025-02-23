import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getBarometerData from "./routes/weather.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
//route to get barometer data to weather.js function
app.get('/api/barometer/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const data = await getBarometerData(city);
    res.json({ body: {
      weather: data.weather,
      barometer: data.barometer
    } });
  } catch (error) {
    console.error(`Error fetching barometer data for city ${city}:`, error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));