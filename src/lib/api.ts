import axios from 'axios';

const API_BASE_URL = 'https://insrisk-weather-service-635514326604.asia-south1.run.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WeatherRequest {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
}

export interface WeatherFile {
  name: string;
  created_at: string;
  size_bytes: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    apparent_temperature_max: (number | null)[];
    apparent_temperature_min: (number | null)[];
  };
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
  };
}

export const storeWeatherData = async (data: WeatherRequest): Promise<{ message: string; file: string }> => {
  const response = await api.post('/store-weather-data', data);
  return response.data;
};

export const listWeatherFiles = async (): Promise<WeatherFile[]> => {
  const response = await api.get<{ files: WeatherFile[] }>('/list-weather-files');
  return response.data.files;
};

export const getWeatherFileContent = async (filename: string): Promise<WeatherData> => {
  const response = await api.get(`/weather-file-content/${filename}`);
  return response.data;
};
