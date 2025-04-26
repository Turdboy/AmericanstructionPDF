import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MenuScreen from '../screens/MenuScreen';
import InspectionWebview from '../screens/InspectionWebview';
import RevisitWebview from '../screens/RevisitWebview';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="StartInspection" component={InspectionWebview} />
    <Stack.Screen name="RevisitInspection" component={RevisitWebview} />
  </Stack.Navigator>
);

export default StackNavigator;
