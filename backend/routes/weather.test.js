import { jest } from '@jest/globals';
import fetch from 'node-fetch';
import getBarometerData from './weather.js';

const mockFetch = jest.fn();

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: mockFetch
}));

const { Response } = await import('node-fetch');

describe('getBarometerData', () => {
  const mockWeatherResponse = {
    current_weather: {
      temperature: 20,
      windspeed: 10,
      weathercode: 200,
      winddirection: 180,
      interval: 60,
      is_day: 1,
      time: new Date().toISOString(),
    },
  };

  const mockBarometerResponse = {
    current: {
      pressure_msl: 1013,
    },
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch weather and barometer data with correct properties for a supported city', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockWeatherResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockBarometerResponse)));

    const data = await getBarometerData('Vilnius');

    // Check if the response has the correct structure
    expect(data).toHaveProperty('weather');
    expect(data).toHaveProperty('barometer');

    // Check weather properties
    const expectedWeatherProperties = [
      'temperature',
      'windspeed',
      'weathercode',
      'winddirection',
      'interval',
      'is_day',
      'time'
    ];

    expectedWeatherProperties.forEach(prop => {
      expect(data.weather).toHaveProperty(prop);
    });

    // Check barometer properties
    expect(data.barometer).toHaveProperty('pressure_msl');
  });

  it('should throw an error for an unsupported city', async () => {
    await expect(getBarometerData('UnsupportedCity')).rejects.toThrow('City not supported');
  });

  it('should throw an error if fetching data fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API error'));
    await expect(getBarometerData('Vilnius')).rejects.toThrow('Unable to retrieve data');
  });
});