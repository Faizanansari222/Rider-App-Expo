import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "twrnc"; 
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { addRideToDB } from "../firebase";

function VehicleSelection() {
  const [fare, setFare] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<
    keyof typeof rates | null
  >(null);
  const params = useLocalSearchParams();
  const {
    pickupName,
    dropoffName,
    pickupAddress,
    dropoffAddress,
    pickupLatitude,
    dropoffLatitude,
    pickupLongitude,
    dropoffLongitude,
  } = params;

  const rates = {
    cycle: 10,
    bike: 20,
    truck: 30,
    car: 60,
    acCar: 90,
  };

  const calculateFare = (vehicle: keyof typeof rates) => {
    setSelectedVehicle(vehicle); // Set the selected vehicle type
    const baseFare = rates[vehicle];
    const distance = calcCrow(
      Number(pickupLatitude),
      Number(pickupLongitude),
      Number(dropoffLatitude),
      Number(dropoffLongitude)
    );
    const fare = baseFare * distance;
    setFare(Math.round(fare));
  };

  function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  const addRide = async () => {
    const ride = {
      pickup: {
        pickupLatitude: pickupLatitude,
        pickupLongitude: pickupLongitude,
        pickupAddress: pickupAddress,
        pickupName: pickupName,
      },

      dropoff: {
        dropoffLatitude: dropoffLatitude,
        dropoffLongitude: dropoffLongitude,
        dropoffAddress: dropoffAddress,
        dropoffName: dropoffName,
      },
      fare,
      selectedVehicle,
      Status: "Panding",
    };
    try {
      await addRideToDB(ride);
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  return (
    <View style={tw`p-4`}>
      <Text>Pickup Location: {pickupName}</Text>
      <Text>Dropoff Location: {dropoffName}</Text>

      <View style={tw`flex-row justify-around my-4`}>
        <TouchableOpacity onPress={() => calculateFare("cycle")}>
          <Ionicons
            name="bicycle-outline"
            size={40}
            color={selectedVehicle === "cycle" ? "blue" : "black"} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => calculateFare("bike")}>
          <FontAwesome
            name="motorcycle"
            size={40}
            color={selectedVehicle === "bike" ? "blue" : "black"} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => calculateFare("truck")}>
          <FontAwesome
            name="truck"
            size={40}
            color={selectedVehicle === "truck" ? "blue" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => calculateFare("car")}>
          <Ionicons
            name="car-outline"
            size={40}
            color={selectedVehicle === "car" ? "blue" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => calculateFare("acCar")}>
          <Ionicons
            name="car-sport-outline"
            size={40}
            color={selectedVehicle === "acCar" ? "blue" : "black"}
          />
        </TouchableOpacity>
      </View>

      {fare !== null && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold`}>Estimated Fare: Rs. {fare}</Text>
        </View>
      )}

      <View style={tw`h-[50%] my-4`}>
        <MapView
          style={tw`flex-1`}
          region={{
            latitude: Number(pickupLatitude),
            longitude: Number(pickupLongitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: Number(pickupLatitude),
              longitude: Number(pickupLongitude),
            }}
            title={pickupName}
            description={pickupAddress}
          />
          <Marker
            coordinate={{
              latitude: Number(dropoffLatitude),
              longitude: Number(dropoffLongitude),
            }}
            title={dropoffName}
            description={dropoffAddress}
          />
        </MapView>
      </View>
      <TouchableOpacity
        style={tw`mt-5 bg-blue-600 p-4 rounded-lg shadow-lg`}
        onPress={addRide}
      >
        <Text style={tw`text-white text-center text-lg font-bold`}>
          get Ready
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default VehicleSelection;
