import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

function DetailsScreen() {
  return (
    <View style={styles.view}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({navigation}) {
  return (
    <View style={styles.view}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
