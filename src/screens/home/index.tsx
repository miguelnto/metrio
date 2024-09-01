import { Pressable, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'react-native'
import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon } from 'react-native-heroicons/outline';
import { Droplet, Wind } from 'react-native-feather';
import { ScrollView } from 'react-native-gesture-handler';
import {debounce} from 'lodash'
import { fetchLocations, fetchWeatherForecast } from '../../services/api/weather';
import { CircleSnail } from 'react-native-progress';
import { getData, storeData } from '../../utils/appstorage';

const Home = () => {
  const [showSearch, toggleSearch] = useState<Boolean>(false);
  
  const [locations, setLocations] = useState<City[]>([])
  const [weather, setWeather] = useState<WeatherData>({
    current: {
      temp_c: 0,
      condition: {
        text: ""
      },
      humidity: 0,
      wind_kph: 0,
    },
    location: {
      name: "",
      country: "",
    },
    forecast: {
      forecastday: [""]
    }

  })
  const [loading, setLoading] = useState<Boolean>(true)


  const handleLocation = (loc: City) => {
    toggleSearch(false)
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then(data => {
      setWeather(data)
      setLoading(false)
      storeData('city', loc.name)
    })
  
  }

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchLocations({cityName: value, days: 1}).then(data => {
        setLocations(data);
      })
    }
  }

  useEffect(() => {
    fetchMyWeatherData()
  }, [])

  const fetchMyWeatherData = async () => {
    const myCity = await getData('city');
    let cityName = 'Brasília';
    if (myCity) cityName = myCity;

    fetchWeatherForecast({
      cityName,
      days: 7
    }).then(data => {
      setWeather(data);
      setLoading(false);
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
  
  const { current, location } = weather;

  const bg = require('../../../assets/images/bg2.png')

  return (
    <View className="flex-1 relative">
      <Image blurRadius={1} source={bg} className='absolute h-full w-full'></Image>
      {
        loading ? (
          <View className='flex-1 flex-row justify-center items-center'>
            <CircleSnail thickness={5} size={70} color="#a9a9a9" />
          </View>
        ):( 
          <><View style={{ height: '7%' }} className='mt-4 mx-4 relative z-50'>
              <View
                className={`flex-row justify-end items-center rounded-full ${showSearch ? 'bg-gray-200' : 'bg-opacity-0'}`}
              >
                {showSearch && (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder='Search city'
                    placeholderTextColor={'darkgray'}
                    className='pl-6 h-10 flex-1 text-base text-gray'
                  ></TextInput>
                )}

                <Pressable
                  onPress={() => toggleSearch(!showSearch)}
                  className='rounded-full p-3 m-1 bg-zinc-700'
                >
                  <MagnifyingGlassIcon size="25" color="white" />
                </Pressable>
              </View>
              {locations.length > 0 && showSearch ? (
                <View className='absolute w-full bg-gray-300 top-16 rounded-3xl'>
                  {locations.map((loc, index) => {
                    return (
                      <Pressable
                        onPress={() => handleLocation(loc)}
                        key={index}
                        className="flex-row items-center border-0 p-3 px-4 mb-1"
                      >
                        <MapPinIcon size="20" color="gray" />
                        <Text className='text-black text-lg ml-3'>{loc?.name}, {loc?.country}</Text>
                      </Pressable>
                    );
                  })}

                </View>
              ) : null}
            </View><View className='mx-4 flex justify-around flex-1 mb-2'>
                <Text className='text-white text-center text-2xl font-bold'>
                  {location?.name},
                  <Text className='text-xl font-semibold text-gray-300'>
                    {" " + location?.country}
                  </Text>
                </Text>
                {/*<View className='flex-row justify-center'>
                  <SunIcon size={100} color="yellow" />
                </View>*/}
                <View className='space-y-2'>
                  <Text className='text-center font-bold text-white text-6xl ml-5'>
                    {current?.temp_c}&#176;
                  </Text>
                  <Text className='text-center font-bold text-white text-xl tracking-widest'>
                    {current?.condition?.text}
                  </Text>
                </View>
                <View className='flex-row justify-between mx-4'>
                  <View className='flex-row space-x-2 items-center'>
                    <Wind width={40} height={40} color={'white'}></Wind>
                    <Text className='text-white font-semibold text-base'>
                      {current?.wind_kph}km
                      </Text>
                  </View>
                  <View className='flex-row space-x-2 items-center'>
                    <Droplet width={40} height={40} color={'white'}></Droplet>
                    <Text className='text-white font-semibold text-base'>
                      {current?.humidity}%
                      </Text>
                  </View>
                  {/*
                  <View className='flex-row space-x-2 items-center'>
                    <NewspaperIcon size={40} color={'white'}></NewspaperIcon>
                    <Text className='text-white font-semibold text-base'>24km</Text>
                  </View>
                  */}
                </View>

                <View className='mb-2 space-y-3'>
                  <View className='flex-row items-center mx-5 space-x-2'>
                    <CalendarDaysIcon size={30} color={'white'} />
                    <Text className='text-white text-base'> Daily forecast (Average Temperature)</Text>
                  </View>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    showsHorizontalScrollIndicator={false}>
                    {weather?.forecast?.forecastday?.map((item: any, index: number) => {
                      return (
                        <View
                          key={index}
                          className='flex justify-center items-center w-28 rounded-3xl py-3 space-y-1 mr-2 bg-zinc-800'
                        >
                          <Text className='text-white'>{item.date}</Text>
                          <Text className='text-white text-xl font-semibold'>
                            {item?.day?.avgtemp_c}&#176;
                          </Text>

                        </View>
                      );
                    })}

                  </ScrollView>

                </View>
              </View></>
        
        )
      
      }
    </View>
  )
}

export default Home;
