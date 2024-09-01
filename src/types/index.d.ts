interface LocationCoords {
    latitude: number
    longitude: number
}

interface SearchParams {
    cityName: string
    days: number
}

interface City {
    name: string
    country: string
}

type WeatherData = {
    current: {
        temp_c: number
        condition: {
            text: string
        }
        wind_kph: number
        humidity: number
    }
    location: City
    forecast: {
        forecastday: string[]
    }
}
