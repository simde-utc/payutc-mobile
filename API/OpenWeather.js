import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

const API_KEY = "0b299f5ec4da9f6cd21e4b30dea072c6";

export function getWeatherFromApi() {
  const url = 'https://samples.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=0b299f5ec4da9f6cd21e4b30dea072c6'
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}
