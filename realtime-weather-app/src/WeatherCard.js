import React from "react";

import styled from "@emotion/styled";

import WeatherIcon from "./WeatherIcon.js";
import { ReactComponent as CloudyIcon } from "./images/airFlow.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RedoIcon } from "./images/rain.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ReactComponent as LightbulbIcon } from "./images/lightbulb.svg";
import { ReactComponent as LightbulbWhiteIcon } from "./images/lightbulb_white.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  /* box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9; */
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  /* color: #212121; */
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  /* color: #828282; */
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const WeatherElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  /* color: #757575; */
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  /* color: #828282; */
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  /* color: #828282; */
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

// const Redo = styled(RedoIcon)`
//   /* 在這裡寫入 CSS 樣式 */
//   width: 15px;
//   height: 15px;
//   position: absolute;
//   right: 15px;
//   bottom: 15px;
//   cursor: pointer;
// `;
const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  /* color: #828282; */
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;
    /* STEP 2：取得傳入的 props 並根據它來決定動畫要不要執行 */
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const Lightbulb = styled.div`
  :hover {
    animation: icon--shake 0.15s linear infinite alternate;
  }
  @keyframes icon--shake {
    0% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(10deg);
    }
  }
`;

const ThemeChange = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
`;

const Cog = styled(CogIcon)`
  /* position: absolute; */
  /* top: 30px; */
  /* right: 15px; */
  width: 15px;
  height: 15px;
  /* cursor: pointer; */
`;

const WeatherCard = (props) => {
  const {
    weatherElement,
    moment,
    fetchData,
    currentTheme,
    setCurrentTheme,
    theme,
    setCurrentPage,
    cityName
  } = props;
  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <ThemeChange>
        <ThemeChange>
          <Cog onClick={() => setCurrentPage("WeatherSetting")} />
          <Lightbulb
            onClick={() => {
              console.log("currentTheme", currentTheme);
              setCurrentTheme(theme[currentTheme].state ? "dark" : "light");
            }}
          >
            {theme[currentTheme].state ? (
              <LightbulbIcon />
            ) : (
              <LightbulbWhiteIcon />
            )}
          </Lightbulb>
        </ThemeChange>
        <Location>{cityName}</Location>
      </ThemeChange>
      <Description>
        {description} {comfortability}
      </Description>
      <WeatherElement>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon currentWeatherCode={weatherCode} moment={moment} />
      </WeatherElement>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {Math.round(rainPossibility)} %
      </Rain>
      <Redo onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric"
        }).format(new Date(observationTime))}{" "}
        {isLoading ? <LoadingIcon /> : <RedoIcon />}
      </Redo>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
