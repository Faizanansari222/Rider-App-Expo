import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [images, setImages] = useState<any[]>([]);
  const camera: any = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={tw`flex-1 justify-center`}>
        <Text style={tw`text-center pb-2`}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    const picture: any = await camera.current.takePictureAsync();
    setImages((prevImages) => prevImages.concat(picture));
  }

  function deleteImage(index: number) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`${images.length > 0 ? "bg-white" : ""}`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`p-4`}
        >
          {images.map((item, index) => (
            <View key={index} style={tw`items-center mr-1`}>
              <Image source={{ uri: item.uri }} style={tw`w-20 h-20`} />
              <TouchableOpacity
                style={tw`mt-2`}
                onPress={() => deleteImage(index)}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <CameraView ref={camera} style={tw`flex-1`} facing={facing}>
        <View
          style={tw`absolute bottom-16 left-0 right-0 flex-row justify-around`}
        >
          <TouchableOpacity
            style={tw`items-center`}
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse-outline" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`} onPress={takePicture}>
            <Ionicons name="camera-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
