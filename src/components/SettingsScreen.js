import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.view}>
      <Text>Settings!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
