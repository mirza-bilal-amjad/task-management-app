import React from "react"
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ImageURISource,
  ColorValue,
} from "react-native"
import { Text } from "./Text"
interface StackedImagesProps {
  images: ImageURISource[]
  size?: number
  borderColor?: ColorValue
}

const overlap = -12 // px overlap between images

/**
 * Displays a horizontal stack of up to three images, with any additional images represented as a "+N" indicator.
 *
 * @param images - An array of image sources to display in the stack.
 * @param size - Optional. The diameter (width and height) of each image in the stack. Defaults to 40.
 *
 * The component shows up to three images, overlapping them horizontally. If there are more than three images,
 * a circular indicator with the count of extra images is shown as the last item in the stack.
 */
export const StackedImages: React.FC<StackedImagesProps> = ({ images, size = 40, borderColor }) => {
  const displayedImages = images.slice(0, 3)
  const extraCount = Math.max(0, images.length - 3)

  // Prepare styles for images and extra count in advance
  const imageStyles = (idx: number): ViewStyle[] => [
    $imageCont,
    {
      width: size,
      height: size,
      marginLeft: idx === 0 ? 0 : overlap,
      zIndex: images.length - idx,
      borderColor: borderColor || "#fff", // Use provided border color or default to white
    },
  ]

  const extraStyles: ViewStyle[] = [
    $extra,
    {
      width: size,
      height: size,
      marginLeft: overlap,
      borderColor: borderColor || "#fff",
    },
  ]

  const extraTextStyles: TextStyle[] = [$extraText, { fontSize: size * 0.45 }]

  return (
    <View style={$row}>
      {displayedImages.map((src, idx) => (
        <View key={idx} style={imageStyles(idx)}>
          <Image source={src} style={$image} />
        </View>
      ))}
      {extraCount > 0 && (
        <View style={extraStyles}>
          <Text style={extraTextStyles}>+{extraCount}</Text>
        </View>
      )}
    </View>
  )
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const $imageCont: ViewStyle = {
  borderRadius: 999,
  overflow: "hidden",
  borderWidth: 2,
  backgroundColor: "#eee",
  position: "relative",
  elevation: 1, // Android shadow
}
const $extra: ViewStyle = {
  borderRadius: 999,
  backgroundColor: "#bbb",
  borderWidth: 2,
  borderColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
  elevation: 1, // Android shadow
  shadowColor: "#000", // iOS shadow
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
}
const $extraText: TextStyle = {
  color: "#fff",
  fontWeight: "600",
}
const $image: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
}
