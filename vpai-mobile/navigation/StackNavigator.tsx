import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import MenuScreen from '../screens/MenuScreen';
import InspectionScreen from '../screens/InspectionScreen';
import SavedInspectionScreen from '../screens/SavedInspectionScreen';
import ImageEditorScreen from '../screens/ImageEditorScreen';




const Stack = createNativeStackNavigator();

const StackNavigator = () => (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Account" component={AccountScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
  <Stack.Screen name="Menu" component={MenuScreen} />
  <Stack.Screen name="StartInspection" component={InspectionScreen} />
  <Stack.Screen name="RevisitInspection" component={SavedInspectionScreen} />
  <Stack.Screen name="ImageEditorScreen" component={ImageEditorScreen} />
</Stack.Navigator>


);

export default StackNavigator;
