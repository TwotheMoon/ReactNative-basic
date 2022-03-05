import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "f4ea50cdc8bc01a38d159901b1d86f81";

const icons = {
  "Clouds": 
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  }
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style='black' />
      {!ok ?
        (
          <View style={styles.noLocation}>
            <Text>We need your loacation ㅠㅠ</Text>
          </View>
        )
        :
        (
          <>
            <View style={styles.city}>
              <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
              pagingEnabled
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weather}>
              {days.length === 0 ? (
                <View style={styles.day}>
                  <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
                </View>
              ) : (
                days.map((day, index) => (
                  <View key={index} style={styles.day}>
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <Text style={styles.description}>{day.weather[0].main}</Text>
                    <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </>
        )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  noLocation: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  city: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 58,
    fontWeight: "500"
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontWeight: "500",
    fontSize: 150,
  },
  description: {
    color: "white",
    marginTop: -30,
    fontSize: 50,
  },
  tinyText: {
    color: "white",
    fontSize: 20,
  }
});
