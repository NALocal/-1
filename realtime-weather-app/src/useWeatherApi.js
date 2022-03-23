import { useState, useEffect, useCallback } from "react";

//定義 handleClick 方法，並呼叫中央氣象局 API
const fetchWeatherElement = (locationName) => {
  return fetch(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-F51C8B17-AD92-4C86-8303-7550993CECDC&locationName=" +
      locationName
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("WeatherElement", data);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        //風速（WDSD）、氣溫（TEMP）和濕度（HUMD）
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        }
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  return fetch(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-F51C8B17-AD92-4C86-8303-7550993CECDC&format=JSON&locationName=" +
      cityName
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("WeatherForecast", data);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const useWeatherApi = (currentLocation) => {
  const { locationName, cityName } = currentLocation;
  //定義會使用到的資料狀態
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  const fetchData = useCallback(() => {
    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    const fetchingData = async () => {
      // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      const data = await Promise.all([
        fetchWeatherElement(locationName),
        fetchWeatherForecast(cityName),
        //redux saga/toolkit
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 1500);
        })
      ]);

      const [currentWeather, weatherForecast] = data;
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });

      console.log("data", data);
    };

    setWeatherElement((prevState) => {
      return {
        ...prevState,
        isLoading: true
      };
    });

    fetchingData();
  }, [locationName, cityName]);

  useEffect(() => {
    // STEP 5：呼叫 fetchData 這個方法
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
