// Home screen
// app/(app)/index.tsx
import { View, Text, StyleSheet } from "react-native";
import { Colors } from '../../src/themes';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black_grey,
  },
  text: {
    color: Colors.white,
    fontSize: 24,
  }
});