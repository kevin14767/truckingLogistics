// Use this template for each:
import { View, Text, StyleSheet } from "react-native";
import { Colors } from '../../src/themes';

export default function reports() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>[Screen Name] Screen</Text>
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