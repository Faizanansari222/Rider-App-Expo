import MapView, { Marker } from "react-native-maps";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function Dropoff() {
  const params = useLocalSearchParams();
  console.log("params", params);
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [dropoffLocation, setdropoffLocation] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const finddropoffLocation = (text: any) => {
    setSearchText(text);
    if (!location) return;

    const { latitude, longitude } = location.coords;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3dDP+4pG7O7Qz/o77os/ht1kRQ9T/UrHbfeYt9gFT5mw=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${text}&ll=${latitude},${longitude}&radius=100000`,
      options
    )
      .then((response) => response.json())
      .then((response) => setSearchResult(response.results))
      .catch((err) => console.error(err));
  };

  // Cancel function to clear input and re-enable
  const cleardropoffLocation = () => {
    setdropoffLocation(null);
    setSearchText("");
    setSearchResult([]);
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Search Bar */}
      <View style={tw`mt-5 p-2 flex-row items-center border bg-white shadow rounded-lg mx-4`}>
        <TextInput
          placeholder="Search Dropoff places"
          style={tw`flex-1 p-3 text-lg text-gray-700`}
          onChangeText={finddropoffLocation}
          value={dropoffLocation ? dropoffLocation.name : searchText}
          editable={!dropoffLocation}
        />

        {dropoffLocation && (
          <TouchableOpacity onPress={cleardropoffLocation}>
            <Ionicons
              name="close-circle"
              size={24}
              color="red"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {searchResult && !dropoffLocation && (
        <View style={tw`w-full mt-2 px-4`}>
          {searchResult.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setdropoffLocation(item)}
              style={tw`p-3 bg-white rounded-lg shadow mb-2`}
            >
              <Text style={tw`font-semibold text-gray-800`}>{item.name}</Text>
              <Text style={tw`text-gray-600 text-sm`}>
                {item.location.formatted_address}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pickup Location */}
      {params && (
        <View style={tw`mt-3 px-4`}>
          <Text style={tw`font-semibold text-lg text-gray-800`}>
            Pickup Location: {params.name}
          </Text>
          <Text style={tw`text-gray-600`}>
            {params.address}
          </Text>
        </View>
      )}

      {/* Map View */}
      {location ? (
        <View style={tw`flex-1 mt-4 px-4`}>
          <MapView
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={tw`w-full h-[60%] rounded-lg shadow-lg`}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        </View>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-red-500`}>
            {errorMsg ? errorMsg : "Fetching location..."}
          </Text>
        </View>
      )}

      {/* Select Car Button */}
      <View style={tw`px-4 mb-6`}>
          <TouchableOpacity
            style={tw`mt-5 bg-blue-600 p-4 rounded-lg shadow-lg`}
            onPress={() =>
              router.push({
                pathname: "/vehicleSelection",
                params: {
                  pickupName: params.name,
                  pickupAddress: params.address,
                  pickupLatitude: params.latitude,
                  pickupLongitude: params.longitude,
                  dropoffName: dropoffLocation.name,
                  dropoffAddress: dropoffLocation.location.formatted_address,
                  dropoffLatitude: dropoffLocation.geocodes.main.latitude,
                  dropoffLongitude: dropoffLocation.geocodes.main.longitude,
                },
              })
            }
          >
            <Text style={tw`text-white text-center text-lg font-bold`}>
              Select Car
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}
