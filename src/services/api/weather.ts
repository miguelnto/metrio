import axios from 'axios'

import { API_KEY } from '@env'

const apiKey = API_KEY;
const forecastEndPoint = (params: SearchParams) => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationsEndPoint = (params: SearchParams) => `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const apiCall = async (endpoint: string) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(options);
        return response.data

    } catch(err) {
        return null
    }
}

export const fetchWeatherForecast = (params: SearchParams) => {
    return apiCall(forecastEndPoint(params))
}

export const fetchLocations = (params: SearchParams) => {
    return apiCall(locationsEndPoint(params));
}