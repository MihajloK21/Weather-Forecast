import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import weatherCode from './weather-codes.json' with {type:"json"}

const app = express()
const port = 3000
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))


const LOCATION_API_KEY = `80ba02ccbe71d30cc18dd29cc3929625`

const randomCity = [
  "London", "Paris", "Berlin", "Moscow", "Rome", "Prague", "Madrid", "New York", "Toronto", "Mexico City", "Athens", "Los Angeles", "Tokyo", "Melbourne"
]



app.get('/', async (req, res) => {
  try {
    let currentLocation

    currentLocation = randomCity[Math.floor(Math.random() * randomCity.length)]
    

    const LOCATION_API_URL = `http://api.positionstack.com/v1/forward?access_key=${LOCATION_API_KEY}&query=${currentLocation}`
    
    const locationData = await axios.get(LOCATION_API_URL)
    const locationInfo = locationData.data

    const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.data[0].latitude}&longitude=${locationInfo.data[0].longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,surface_pressure,visibility,wind_speed_80m,temperature_80m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`

    const weatherData = await axios.get(WEATHER_API_URL)
    const weatherInfo = weatherData.data

    const currentTime = new Date().toLocaleString("en-US", {timeZone: `${weatherInfo.timezone}`})

    let fixTime = currentTime.slice(11, 16)

    if (fixTime.charAt(fixTime.length - 1) === ":") {
      fixTime = `0${fixTime.slice(0, fixTime.length - 1)}`
    }

    let hourIndex = weatherInfo.current.time.slice(11, 13)

      if (hourIndex.charAt(0) === '0') {
        hourIndex = hourIndex.slice(1, hourIndex.length) - 1
      }
      if (hourIndex < 0) {
        hourIndex = 12
      }
  
    const imgInfo = weatherInfo.current.weather_code
    let dayImg
    let nightImg

    switch(imgInfo) {
      case 0 :
        dayImg = "sunny.png"
        nightImg = "night-clear.png"
      break
      
      case 1 :
        dayImg = "sunny-cloudy.png"
        nightImg = "night-clear-cloudy.png"
      break
      
      case 2 :
        dayImg = "sunny-cloudy.png"
        nightImg = "night-clear-cloudy.png"
      break
      
      case 3 :
        dayImg = "cloudy.png"
        nightImg = "cloudy.png"
      break
      
      case 45 :
        dayImg = "fog.png"
        nightImg = "fog.png"
      break
      
      case 48 :
        dayImg = "fog.png"
        nightImg = "fog.png"
      break
      
      case 51 :
        dayImg = "sunny-cloudy-light-rain.png"
        nightImg = "night-clear-cloudy-light-rain.png"
      break
      
      case 53 :
        dayImg = "sunny-cloudy-moderate-rain.png"
        nightImg = "night-clear-cloudy-moderate-rain.png"
      break
      
      case 55 :
        dayImg = "sunny-cloudy-heavy-rain.png"
        nightImg = "night-clear-cloudy-heavy-rain.png"
      break
      
      case 56 :
        dayImg = "cloudy-light-rain.png" // freezing
        nightImg = "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        dayImg = "cloudy-moderate-rain.png" // freezing
        nightImg = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        dayImg = "cloudy-light-rain.png"
        nightImg = "cloudy-light-rain.png"
      break
      
      case 63 :
        dayImg = "cloudy-moderate-rain.png"
        nightImg = "cloudy-moderate-rain.png"
      break
      
      case 65 :
        dayImg = "cloudy-heavy-rain.png"
        nightImg = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        dayImg = "cloudy-light-rain.png" // freezing
        nightImg = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        dayImg = "cloudy-moderate-rain.png" // freezing
        nightImg = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        dayImg = "sunny-cloudy-snow.png"
        nightImg = "night-clear-cloudy-snow.png"
      break
      
      case 73 :
        dayImg = "snow.png" 
        nightImg = "snow.png"
      break
      
      case 77 :
        dayImg = "snow.png" 
        nightImg = "snow.png"
      break
      
      case 80 :
        dayImg = "sunny-cloudy-light-rain.png"
        nightImg = "night-clear-cloudy-light-rain.png"
      break
      
      case 81 :
        dayImg = "sunny-cloudy-moderate-rain.png"
        nightImg = "night-clear-cloudy-moderate-rain.png"
      break
      
      case 82 :
        dayImg = "sunny-cloudy-heavy-rain.png"
        nightImg = "night-clear-cloudy-heavy-rain.png"
      break
      
      case 85 :
        dayImg = "sunny-cloudy-light-rain.png" // with snow
        nightImg = "night-clear-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        dayImg = "sunny-cloudy-moderate-rain.png" // with snow
        nightImg = "night-clear-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        dayImg = "thunder.png"
        nightImg = "thunder.png" 
      break
      
      case 96 :
        dayImg = "cloudy-drizzle-thunder.png" 
        nightImg = "cloudy-drizzle-thunder.png"
      break
      
      case 99 :
        dayImg = "cloudy-drizzle-thunder.png" 
        nightImg = "cloudy-drizzle-thunder.png" 
      break
    }


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    //* Day 1

    const day_1_weather = weatherInfo.daily.weather_code[0]
    let day_1_img
    const day_1_name = weatherCode[weatherInfo.daily.weather_code[0]].day.description
    const day_1_min = weatherInfo.daily.temperature_2m_min[0]
    const day_1_max = weatherInfo.daily.temperature_2m_max[0]
    const shortDate1 = weatherInfo.daily.time[0]
    const day_1_date = shortDate1.slice(shortDate1.length - 2,  shortDate1.length)
    const day_1_month = months[shortDate1.slice(6, 7) - 1]
    
    switch(day_1_weather) {
      case 0 :
        day_1_img = "sunny.png"
      break
      
      case 1 :
        day_1_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_1_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_1_img = "cloudy.png"
      break
      
      case 45 :
        day_1_img = "fog.png"
      break
      
      case 48 :
        day_1_img = "fog.png"
      break
      
      case 51 :
        day_1_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_1_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_1_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_1_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_1_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_1_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_1_img = "sunny.png"
      break
      
      case 65 :
        day_1_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_1_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_1_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_1_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_1_img = "snow.png" 
      break
      
      case 77 :
        day_1_img = "snow.png" 
      break
      
      case 80 :
        day_1_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_1_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_1_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_1_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_1_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_1_img = "thunder.png"
      break
      
      case 96 :
        day_1_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_1_img = "cloudy-drizzle-thunder.png" 
      break
    }
    

    //* Day 2

    const day_2_weather = weatherInfo.daily.weather_code[1]
    let day_2_img 
    const day_2_name = weatherCode[weatherInfo.daily.weather_code[1]].day.description
    const day_2_min = weatherInfo.daily.temperature_2m_min[1]
    const day_2_max = weatherInfo.daily.temperature_2m_max[1]
    const shortDate2 = weatherInfo.daily.time[1]
    const day_2_date = shortDate2.slice(shortDate2.length - 2,  shortDate2.length)
    const day_2_month = months[shortDate2.slice(6, 7) - 1]
    
    switch(day_2_weather) {
      case 0 :
        day_2_img = "sunny.png"
      break
      
      case 1 :
        day_2_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_2_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_2_img = "cloudy.png"
      break
      
      case 45 :
        day_2_img = "fog.png"
      break
      
      case 48 :
        day_2_img = "fog.png"
      break
      
      case 51 :
        day_2_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_2_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_2_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_2_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_2_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_2_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_2_img = "sunny.png"
      break
      
      case 65 :
        day_2_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_2_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_2_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_2_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_2_img = "snow.png" 
      break
      
      case 77 :
        day_2_img = "snow.png" 
      break
      
      case 80 :
        day_2_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_2_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_2_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_2_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_2_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_2_img = "thunder.png"
      break
      
      case 96 :
        day_2_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_2_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 3
    
    const day_3_weather = weatherInfo.daily.weather_code[2]
    let day_3_img  
    const day_3_name = weatherCode[weatherInfo.daily.weather_code[2]].day.description
    const day_3_min = weatherInfo.daily.temperature_2m_min[2]
    const day_3_max = weatherInfo.daily.temperature_2m_max[2]
    const shortDate3 = weatherInfo.daily.time[2]
    const day_3_date = shortDate3.slice(shortDate3.length - 2,  shortDate3.length)
    const day_3_month = months[shortDate3.slice(6, 7) - 1]
    
    switch(day_3_weather) {
      case 0 :
        day_3_img = "sunny.png"
      break
      
      case 1 :
        day_3_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_3_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_3_img = "cloudy.png"
      break
      
      case 45 :
        day_3_img = "fog.png"
      break
      
      case 48 :
        day_3_img = "fog.png"
      break
      
      case 51 :
        day_3_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_3_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_3_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_3_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_3_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_3_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_3_img = "sunny.png"
      break
      
      case 65 :
        day_3_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_3_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_3_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_3_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_3_img = "snow.png" 
      break
      
      case 77 :
        day_3_img = "snow.png" 
      break
      
      case 80 :
        day_3_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_3_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_3_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_3_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_3_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_3_img = "thunder.png"
      break
      
      case 96 :
        day_3_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_3_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 4
    
    const day_4_weather = weatherInfo.daily.weather_code[3]
    let day_4_img  
    const day_4_name = weatherCode[weatherInfo.daily.weather_code[3]].day.description
    const day_4_min = weatherInfo.daily.temperature_2m_min[3]
    const day_4_max = weatherInfo.daily.temperature_2m_max[3]
    const shortDate4 = weatherInfo.daily.time[3]
    const day_4_date = shortDate4.slice(shortDate4.length - 2,  shortDate4.length)
    const day_4_month = months[shortDate4.slice(6, 7) - 1]
    
    switch(day_4_weather) {
      case 0 :
        day_4_img = "sunny.png"
      break
      
      case 1 :
        day_4_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_4_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_4_img = "cloudy.png"
      break
      
      case 45 :
        day_4_img = "fog.png"
      break
      
      case 48 :
        day_4_img = "fog.png"
      break
      
      case 51 :
        day_4_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_4_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_4_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_4_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_4_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_4_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_4_img = "sunny.png"
      break
      
      case 65 :
        day_4_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_4_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_4_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_4_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_4_img = "snow.png" 
      break
      
      case 77 :
        day_4_img = "snow.png" 
      break
      
      case 80 :
        day_4_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_4_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_4_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_4_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_4_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_4_img = "thunder.png"
      break
      
      case 96 :
        day_4_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_4_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 5
    
    const day_5_weather = weatherInfo.daily.weather_code[4]
    let day_5_img  
    const day_5_name = weatherCode[weatherInfo.daily.weather_code[4]].day.description
    const day_5_min = weatherInfo.daily.temperature_2m_min[4]
    const day_5_max = weatherInfo.daily.temperature_2m_max[4]
    const shortDate5 = weatherInfo.daily.time[4]
    const day_5_date = shortDate5.slice(shortDate5.length - 2,  shortDate5.length)
    const day_5_month = months[shortDate5.slice(6, 7) - 1]
    
    switch(day_5_weather) {
      case 0 :
        day_5_img = "sunny.png"
      break
      
      case 1 :
        day_5_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_5_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_5_img = "cloudy.png"
      break
      
      case 45 :
        day_5_img = "fog.png"
      break
      
      case 48 :
        day_5_img = "fog.png"
      break
      
      case 51 :
        day_5_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_5_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_5_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_5_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_5_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_5_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_5_img = "sunny.png"
      break
      
      case 65 :
        day_5_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_5_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_5_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_5_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_5_img = "snow.png" 
      break
      
      case 77 :
        day_5_img = "snow.png" 
      break
      
      case 80 :
        day_5_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_5_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_5_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_5_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_5_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_5_img = "thunder.png"
      break
      
      case 96 :
        day_5_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_5_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 6
    
    const day_6_weather = weatherInfo.daily.weather_code[5]
    let day_6_img  
    const day_6_name = weatherCode[weatherInfo.daily.weather_code[5]].day.description
    const day_6_min = weatherInfo.daily.temperature_2m_min[5]
    const day_6_max = weatherInfo.daily.temperature_2m_max[5]
    const shortDate6 = weatherInfo.daily.time[5]
    const day_6_date = shortDate6.slice(shortDate6.length - 2,  shortDate6.length)
    const day_6_month = months[shortDate6.slice(6, 7) - 1]
    
    switch(day_6_weather) {
      case 0 :
        day_6_img = "sunny.png"
      break
      
      case 1 :
        day_6_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_6_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_6_img = "cloudy.png"
      break
      
      case 45 :
        day_6_img = "fog.png"
      break
      
      case 48 :
        day_6_img = "fog.png"
      break
      
      case 51 :
        day_6_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_6_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_6_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_6_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_6_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_6_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_6_img = "sunny.png"
      break
      
      case 65 :
        day_6_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_6_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_6_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_6_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_6_img = "snow.png" 
      break
      
      case 77 :
        day_6_img = "snow.png" 
      break
      
      case 80 :
        day_6_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_6_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_6_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_6_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_6_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_6_img = "thunder.png"
      break
      
      case 96 :
        day_6_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_6_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 7
    
    const day_7_weather = weatherInfo.daily.weather_code[6]
    let day_7_img 
    const day_7_name = weatherCode[weatherInfo.daily.weather_code[6]].day.description 
    const day_7_min = weatherInfo.daily.temperature_2m_min[6]
    const day_7_max = weatherInfo.daily.temperature_2m_max[6]
    const shortDate7 = weatherInfo.daily.time[6]
    const day_7_date = shortDate7.slice(shortDate7.length - 2,  shortDate7.length)
    const day_7_month = months[shortDate7.slice(6, 7) - 1]
    
    switch(day_7_weather) {
      case 0 :
        day_7_img = "sunny.png"
      break
      
      case 1 :
        day_7_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_7_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_7_img = "cloudy.png"
      break
      
      case 45 :
        day_7_img = "fog.png"
      break
      
      case 48 :
        day_7_img = "fog.png"
      break
      
      case 51 :
        day_7_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_7_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_7_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_7_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_7_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_7_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_7_img = "sunny.png"
      break
      
      case 65 :
        day_7_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_7_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_7_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_7_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_7_img = "snow.png" 
      break
      
      case 77 :
        day_7_img = "snow.png" 
      break
      
      case 80 :
        day_7_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_7_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_7_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_7_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_7_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_7_img = "thunder.png"
      break
      
      case 96 :
        day_7_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_7_img = "cloudy-drizzle-thunder.png" 
      break
    }


    res.render("index.ejs", { 
      name: currentLocation,
      temp: Math.floor(weatherInfo.current.temperature_2m),
      date: weatherInfo.current.time.slice(0, 10),
      time: `${fixTime} ${currentTime.slice(currentTime.length - 2, currentTime.length)}`,
      day_img: dayImg,
      night_img: nightImg,

      checkDay: weatherInfo.current.is_day,
      day: weatherCode[weatherInfo.current.weather_code].day.description,
      night: weatherCode[weatherInfo.current.weather_code].night.description,

      sunrise: weatherInfo.daily.sunrise[0].slice(11, 16),
      sunset: weatherInfo.daily.sunset[0].slice(11, 16),


      precipitation: weatherInfo.current.precipitation,
      wind: Math.floor(weatherInfo.current.wind_speed_10m),
      humidity: weatherInfo.current.relative_humidity_2m,
      feels: Math.floor(weatherInfo.current.apparent_temperature),
      visibility: Math.floor(weatherInfo.hourly.visibility[hourIndex]/1000),
      uv_index: Math.floor(weatherInfo.hourly.uv_index[hourIndex]),
      pressure: Math.floor(weatherInfo.current.surface_pressure),
      dew_point: Math.floor(weatherInfo.hourly.dew_point_2m[hourIndex]),

      day_1_img: day_1_img,
      day_2_img: day_2_img,
      day_3_img: day_3_img,
      day_4_img: day_4_img,
      day_5_img: day_5_img,
      day_6_img: day_6_img,
      day_7_img: day_7_img,

      day_1_name: day_1_name,
      day_2_name: day_2_name,
      day_3_name: day_3_name,
      day_4_name: day_4_name,
      day_5_name: day_5_name,
      day_6_name: day_6_name,
      day_7_name: day_7_name,

      day_1_min: Math.floor(day_1_min),
      day_2_min: Math.floor(day_2_min),
      day_3_min: Math.floor(day_3_min),
      day_3_min: Math.floor(day_3_min),
      day_4_min: Math.floor(day_4_min),
      day_5_min: Math.floor(day_5_min),
      day_6_min: Math.floor(day_6_min),
      day_7_min: Math.floor(day_7_min),

      day_1_max: Math.floor(day_1_max),
      day_2_max: Math.floor(day_2_max),
      day_3_max: Math.floor(day_3_max),
      day_4_max: Math.floor(day_4_max),
      day_5_max: Math.floor(day_5_max),
      day_6_max: Math.floor(day_6_max),
      day_7_max: Math.floor(day_7_max),

      day_1_date: `${day_1_date} ${day_1_month}`,
      day_2_date: `${day_2_date} ${day_2_month}`,
      day_3_date: `${day_3_date} ${day_3_month}`,
      day_4_date: `${day_4_date} ${day_4_month}`,
      day_5_date: `${day_5_date} ${day_5_month}`,
      day_6_date: `${day_6_date} ${day_6_month}`,
      day_7_date: `${day_7_date} ${day_7_month}`,
    })
  } catch (error) {
    console.error(`Error status code ${error.message}`)
    res.status(500)
  }
})


//* Search desired location



app.post('/search',  async (req, res) => {
  const searchBar = req.body.search_bar

  try {
    const LOCATION_API_URL = `http://api.positionstack.com/v1/forward?access_key=${LOCATION_API_KEY}&query=${searchBar}`
    
    const locationData = await axios.get(LOCATION_API_URL)
    const locationInfo = locationData.data

    const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.data[0].latitude}&longitude=${locationInfo.data[0].longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,surface_pressure,visibility,wind_speed_80m,temperature_80m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`

    const weatherData = await axios.get(WEATHER_API_URL)
    const weatherInfo = weatherData.data

    const currentTime = new Date().toLocaleString("en-US", {timeZone: `${weatherInfo.timezone}`})

    let fixTime = currentTime.slice(11, 16)

    if (fixTime.charAt(fixTime.length - 1) === ":") {
      fixTime = `0${fixTime.slice(0, fixTime.length - 1)}`
    }

    let hourIndex = weatherInfo.current.time.slice(11, 13)

      if (hourIndex.charAt(0) === '0') {
        hourIndex = hourIndex.slice(1, hourIndex.length) - 1
      }
      if (hourIndex < 0) {
        hourIndex = 12
      }
  
    const imgInfo = weatherInfo.current.weather_code
    let dayImg
    let nightImg

    switch(imgInfo) {
      case 0 :
        dayImg = "sunny.png"
        nightImg = "night-clear.png"
      break
      
      case 1 :
        dayImg = "sunny-cloudy.png"
        nightImg = "night-clear-cloudy.png"
      break
      
      case 2 :
        dayImg = "sunny-cloudy.png"
        nightImg = "night-clear-cloudy.png"
      break
      
      case 3 :
        dayImg = "cloudy.png"
        nightImg = "cloudy.png"
      break
      
      case 45 :
        dayImg = "fog.png"
        nightImg = "fog.png"
      break
      
      case 48 :
        dayImg = "fog.png"
        nightImg = "fog.png"
      break
      
      case 51 :
        dayImg = "sunny-cloudy-light-rain.png"
        nightImg = "night-clear-cloudy-light-rain.png"
      break
      
      case 53 :
        dayImg = "sunny-cloudy-moderate-rain.png"
        nightImg = "night-clear-cloudy-moderate-rain.png"
      break
      
      case 55 :
        dayImg = "sunny-cloudy-heavy-rain.png"
        nightImg = "night-clear-cloudy-heavy-rain.png"
      break
      
      case 56 :
        dayImg = "cloudy-light-rain.png" // freezing
        nightImg = "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        dayImg = "cloudy-moderate-rain.png" // freezing
        nightImg = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        dayImg = "cloudy-light-rain.png"
        nightImg = "cloudy-light-rain.png"
      break
      
      case 63 :
        dayImg = "cloudy-moderate-rain.png"
        nightImg = "cloudy-moderate-rain.png"
      break
      
      case 65 :
        dayImg = "cloudy-heavy-rain.png"
        nightImg = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        dayImg = "cloudy-light-rain.png" // freezing
        nightImg = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        dayImg = "cloudy-moderate-rain.png" // freezing
        nightImg = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        dayImg = "sunny-cloudy-snow.png"
        nightImg = "night-clear-cloudy-snow.png"
      break
      
      case 73 :
        dayImg = "snow.png" 
        nightImg = "snow.png"
      break
      
      case 77 :
        dayImg = "snow.png" 
        nightImg = "snow.png"
      break
      
      case 80 :
        dayImg = "sunny-cloudy-light-rain.png"
        nightImg = "night-clear-cloudy-light-rain.png"
      break
      
      case 81 :
        dayImg = "sunny-cloudy-moderate-rain.png"
        nightImg = "night-clear-cloudy-moderate-rain.png"
      break
      
      case 82 :
        dayImg = "sunny-cloudy-heavy-rain.png"
        nightImg = "night-clear-cloudy-heavy-rain.png"
      break
      
      case 85 :
        dayImg = "sunny-cloudy-light-rain.png" // with snow
        nightImg = "night-clear-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        dayImg = "sunny-cloudy-moderate-rain.png" // with snow
        nightImg = "night-clear-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        dayImg = "thunder.png"
        nightImg = "thunder.png" 
      break
      
      case 96 :
        dayImg = "cloudy-drizzle-thunder.png" 
        nightImg = "cloudy-drizzle-thunder.png"
      break
      
      case 99 :
        dayImg = "cloudy-drizzle-thunder.png" 
        nightImg = "cloudy-drizzle-thunder.png" 
      break
    }


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    //* Day 1

    const day_1_weather = weatherInfo.daily.weather_code[0]
    let day_1_img
    const day_1_name = weatherCode[weatherInfo.daily.weather_code[0]].day.description
    const day_1_min = weatherInfo.daily.temperature_2m_min[0]
    const day_1_max = weatherInfo.daily.temperature_2m_max[0]
    const shortDate1 = weatherInfo.daily.time[0]
    const day_1_date = shortDate1.slice(shortDate1.length - 2,  shortDate1.length)
    const day_1_month = months[shortDate1.slice(6, 7) - 1]
    
    switch(day_1_weather) {
      case 0 :
        day_1_img = "sunny.png"
      break
      
      case 1 :
        day_1_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_1_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_1_img = "cloudy.png"
      break
      
      case 45 :
        day_1_img = "fog.png"
      break
      
      case 48 :
        day_1_img = "fog.png"
      break
      
      case 51 :
        day_1_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_1_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_1_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_1_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_1_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_1_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_1_img = "sunny.png"
      break
      
      case 65 :
        day_1_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_1_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_1_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_1_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_1_img = "snow.png" 
      break
      
      case 77 :
        day_1_img = "snow.png" 
      break
      
      case 80 :
        day_1_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_1_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_1_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_1_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_1_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_1_img = "thunder.png"
      break
      
      case 96 :
        day_1_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_1_img = "cloudy-drizzle-thunder.png" 
      break
    }

    //* Day 2

    const day_2_weather = weatherInfo.daily.weather_code[1]
    let day_2_img 
    const day_2_name = weatherCode[weatherInfo.daily.weather_code[1]].day.description
    const day_2_min = weatherInfo.daily.temperature_2m_min[1]
    const day_2_max = weatherInfo.daily.temperature_2m_max[1]
    const shortDate2 = weatherInfo.daily.time[1]
    const day_2_date = shortDate2.slice(shortDate2.length - 2,  shortDate2.length)
    const day_2_month = months[shortDate2.slice(6, 7) - 1]
    
    switch(day_2_weather) {
      case 0 :
        day_2_img = "sunny.png"
      break
      
      case 1 :
        day_2_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_2_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_2_img = "cloudy.png"
      break
      
      case 45 :
        day_2_img = "fog.png"
      break
      
      case 48 :
        day_2_img = "fog.png"
      break
      
      case 51 :
        day_2_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_2_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_2_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_2_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_2_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_2_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_2_img = "sunny.png"
      break
      
      case 65 :
        day_2_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_2_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_2_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_2_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_2_img = "snow.png" 
      break
      
      case 77 :
        day_2_img = "snow.png" 
      break
      
      case 80 :
        day_2_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_2_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_2_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_2_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_2_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_2_img = "thunder.png"
      break
      
      case 96 :
        day_2_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_2_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 3
    
    const day_3_weather = weatherInfo.daily.weather_code[2]
    let day_3_img  
    const day_3_name = weatherCode[weatherInfo.daily.weather_code[2]].day.description
    const day_3_min = weatherInfo.daily.temperature_2m_min[2]
    const day_3_max = weatherInfo.daily.temperature_2m_max[2]
    const shortDate3 = weatherInfo.daily.time[2]
    const day_3_date = shortDate3.slice(shortDate3.length - 2,  shortDate3.length)
    const day_3_month = months[shortDate3.slice(6, 7) - 1]
    
    switch(day_3_weather) {
      case 0 :
        day_3_img = "sunny.png"
      break
      
      case 1 :
        day_3_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_3_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_3_img = "cloudy.png"
      break
      
      case 45 :
        day_3_img = "fog.png"
      break
      
      case 48 :
        day_3_img = "fog.png"
      break
      
      case 51 :
        day_3_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_3_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_3_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_3_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_3_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_3_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_3_img = "sunny.png"
      break
      
      case 65 :
        day_3_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_3_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_3_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_3_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_3_img = "snow.png" 
      break
      
      case 77 :
        day_3_img = "snow.png" 
      break
      
      case 80 :
        day_3_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_3_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_3_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_3_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_3_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_3_img = "thunder.png"
      break
      
      case 96 :
        day_3_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_3_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 4
    
    const day_4_weather = weatherInfo.daily.weather_code[3]
    let day_4_img  
    const day_4_name = weatherCode[weatherInfo.daily.weather_code[3]].day.description
    const day_4_min = weatherInfo.daily.temperature_2m_min[3]
    const day_4_max = weatherInfo.daily.temperature_2m_max[3]
    const shortDate4 = weatherInfo.daily.time[3]
    const day_4_date = shortDate4.slice(shortDate4.length - 2,  shortDate4.length)
    const day_4_month = months[shortDate4.slice(6, 7) - 1]
    
    switch(day_4_weather) {
      case 0 :
        day_4_img = "sunny.png"
      break
      
      case 1 :
        day_4_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_4_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_4_img = "cloudy.png"
      break
      
      case 45 :
        day_4_img = "fog.png"
      break
      
      case 48 :
        day_4_img = "fog.png"
      break
      
      case 51 :
        day_4_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_4_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_4_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_4_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_4_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_4_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_4_img = "sunny.png"
      break
      
      case 65 :
        day_4_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_4_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_4_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_4_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_4_img = "snow.png" 
      break
      
      case 77 :
        day_4_img = "snow.png" 
      break
      
      case 80 :
        day_4_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_4_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_4_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_4_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_4_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_4_img = "thunder.png"
      break
      
      case 96 :
        day_4_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_4_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 5
    
    const day_5_weather = weatherInfo.daily.weather_code[4]
    let day_5_img  
    const day_5_name = weatherCode[weatherInfo.daily.weather_code[4]].day.description
    const day_5_min = weatherInfo.daily.temperature_2m_min[4]
    const day_5_max = weatherInfo.daily.temperature_2m_max[4]
    const shortDate5 = weatherInfo.daily.time[4]
    const day_5_date = shortDate5.slice(shortDate5.length - 2,  shortDate5.length)
    const day_5_month = months[shortDate5.slice(6, 7) - 1]
    
    switch(day_5_weather) {
      case 0 :
        day_5_img = "sunny.png"
      break
      
      case 1 :
        day_5_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_5_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_5_img = "cloudy.png"
      break
      
      case 45 :
        day_5_img = "fog.png"
      break
      
      case 48 :
        day_5_img = "fog.png"
      break
      
      case 51 :
        day_5_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_5_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_5_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_5_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_5_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_5_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_5_img = "sunny.png"
      break
      
      case 65 :
        day_5_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_5_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_5_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_5_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_5_img = "snow.png" 
      break
      
      case 77 :
        day_5_img = "snow.png" 
      break
      
      case 80 :
        day_5_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_5_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_5_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_5_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_5_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_5_img = "thunder.png"
      break
      
      case 96 :
        day_5_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_5_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 6
    
    const day_6_weather = weatherInfo.daily.weather_code[5]
    let day_6_img  
    const day_6_name = weatherCode[weatherInfo.daily.weather_code[5]].day.description
    const day_6_min = weatherInfo.daily.temperature_2m_min[5]
    const day_6_max = weatherInfo.daily.temperature_2m_max[5]
    const shortDate6 = weatherInfo.daily.time[5]
    const day_6_date = shortDate6.slice(shortDate6.length - 2,  shortDate6.length)
    const day_6_month = months[shortDate6.slice(6, 7) - 1]
    
    switch(day_6_weather) {
      case 0 :
        day_6_img = "sunny.png"
      break
      
      case 1 :
        day_6_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_6_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_6_img = "cloudy.png"
      break
      
      case 45 :
        day_6_img = "fog.png"
      break
      
      case 48 :
        day_6_img = "fog.png"
      break
      
      case 51 :
        day_6_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_6_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_6_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_6_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_6_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_6_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_6_img = "sunny.png"
      break
      
      case 65 :
        day_6_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_6_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_6_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_6_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_6_img = "snow.png" 
      break
      
      case 77 :
        day_6_img = "snow.png" 
      break
      
      case 80 :
        day_6_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_6_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_6_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_6_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_6_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_6_img = "thunder.png"
      break
      
      case 96 :
        day_6_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_6_img = "cloudy-drizzle-thunder.png" 
      break
    }


    //* Day 7
    
    const day_7_weather = weatherInfo.daily.weather_code[6]
    let day_7_img 
    const day_7_name = weatherCode[weatherInfo.daily.weather_code[6]].day.description 
    const day_7_min = weatherInfo.daily.temperature_2m_min[6]
    const day_7_max = weatherInfo.daily.temperature_2m_max[6]
    const shortDate7 = weatherInfo.daily.time[6]
    const day_7_date = shortDate7.slice(shortDate7.length - 2,  shortDate7.length)
    const day_7_month = months[shortDate7.slice(6, 7) - 1]
    
    switch(day_7_weather) {
      case 0 :
        day_7_img = "sunny.png"
      break
      
      case 1 :
        day_7_img = "sunny-cloudy.png"
      break
      
      case 2 :
        day_7_img = "sunny-cloudy.png"
      break
      
      case 3 :
        day_7_img = "cloudy.png"
      break
      
      case 45 :
        day_7_img = "fog.png"
      break
      
      case 48 :
        day_7_img = "fog.png"
      break
      
      case 51 :
        day_7_img = "sunny-cloudy-light-rain.png"
      break
      
      case 53 :
        day_7_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 55 :
        day_7_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 56 :
        day_7_img =  "cloudy-light-rain.png" // freezing
      break
      
      case 57 :
        day_7_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 61 :
        day_7_img = "cloudy-light-rain.png"
      break
      
      case 63 :
        day_7_img = "sunny.png"
      break
      
      case 65 :
        day_7_img = "cloudy-heavy-rain.png"
      break
      
      case 66 :
        day_7_img = "cloudy-light-rain.png" // freezing
      break
      
      case 67 :
        day_7_img = "cloudy-moderate-rain.png" // freezing
      break
      
      case 71 :
        day_7_img = "sunny-cloudy-snow.png"
      break
      
      case 73 :
        day_7_img = "snow.png" 
      break
      
      case 77 :
        day_7_img = "snow.png" 
      break
      
      case 80 :
        day_7_img = "sunny-cloudy-light-rain.png"
      break
      
      case 81 :
        day_7_img = "sunny-cloudy-moderate-rain.png"
      break
      
      case 82 :
        day_7_img = "sunny-cloudy-heavy-rain.png"
      break
      
      case 85 :
        day_7_img = "sunny-cloudy-light-rain.png" // with snow
      break
      
      case 86 :
        day_7_img = "sunny-cloudy-moderate-rain.png" // with snow
      break
      
      case 95 :
        day_7_img = "thunder.png"
      break
      
      case 96 :
        day_7_img = "cloudy-drizzle-thunder.png" 
      break
      
      case 99 :
        day_7_img = "cloudy-drizzle-thunder.png" 
      break
    }


    res.render("index.ejs", { 
      name: searchBar,
      temp: Math.floor(weatherInfo.current.temperature_2m),
      date: weatherInfo.current.time.slice(0, 10),
      time: `${fixTime} ${currentTime.slice(currentTime.length - 2, currentTime.length)}`,
      day_img: dayImg,
      night_img: nightImg,

      checkDay: weatherInfo.current.is_day,
      day: weatherCode[weatherInfo.current.weather_code].day.description,
      night: weatherCode[weatherInfo.current.weather_code].night.description,

      sunrise: weatherInfo.daily.sunrise[0].slice(11, 16),
      sunset: weatherInfo.daily.sunset[0].slice(11, 16),


      precipitation: weatherInfo.current.precipitation,
      wind: Math.floor(weatherInfo.current.wind_speed_10m),
      humidity: weatherInfo.current.relative_humidity_2m,
      feels: Math.floor(weatherInfo.current.apparent_temperature),
      visibility: Math.floor(weatherInfo.hourly.visibility[hourIndex]/1000),
      uv_index: Math.floor(weatherInfo.hourly.uv_index[hourIndex]),
      pressure: Math.floor(weatherInfo.current.surface_pressure),
      dew_point: Math.floor(weatherInfo.hourly.dew_point_2m[hourIndex]),

      day_1_img: day_1_img,
      day_2_img: day_2_img,
      day_3_img: day_3_img,
      day_4_img: day_4_img,
      day_5_img: day_5_img,
      day_6_img: day_6_img,
      day_7_img: day_7_img,

      day_1_name: day_1_name,
      day_2_name: day_2_name,
      day_3_name: day_3_name,
      day_4_name: day_4_name,
      day_5_name: day_5_name,
      day_6_name: day_6_name,
      day_7_name: day_7_name,

      day_1_min: Math.floor(day_1_min),
      day_2_min: Math.floor(day_2_min),
      day_3_min: Math.floor(day_3_min),
      day_3_min: Math.floor(day_3_min),
      day_4_min: Math.floor(day_4_min),
      day_5_min: Math.floor(day_5_min),
      day_6_min: Math.floor(day_6_min),
      day_7_min: Math.floor(day_7_min),

      day_1_max: Math.floor(day_1_max),
      day_2_max: Math.floor(day_2_max),
      day_3_max: Math.floor(day_3_max),
      day_4_max: Math.floor(day_4_max),
      day_5_max: Math.floor(day_5_max),
      day_6_max: Math.floor(day_6_max),
      day_7_max: Math.floor(day_7_max),

      day_1_date: `${day_1_date} ${day_1_month}`,
      day_2_date: `${day_2_date} ${day_2_month}`,
      day_3_date: `${day_3_date} ${day_3_month}`,
      day_4_date: `${day_4_date} ${day_4_month}`,
      day_5_date: `${day_5_date} ${day_5_month}`,
      day_6_date: `${day_6_date} ${day_6_month}`,
      day_7_date: `${day_7_date} ${day_7_month}`,
    })
  } catch (error) {
    console.error(`Error status code ${error.message}`)
    res.render("error.ejs", {message: "Error - You must enter a location before searching"})
    res.status(500)
  }
})

app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
})









