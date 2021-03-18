import React from 'react';
import {View, Text} from 'react-native';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <Text style={{fontSize: 50, color: 'white'}}>Hello</Text>
    </View>
  );
}
