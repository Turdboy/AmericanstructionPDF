import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const CreateAccountScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleCreateAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Menu' }] });
    } catch (error) {
      alert('Account creation failed.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create Account</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
      />
      <TouchableOpacity onPress={handleCreateAccount} style={{ backgroundColor: 'green', padding: 15, borderRadius: 5 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
        <Text style={{ color: 'green', textAlign: 'center' }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateAccountScreen;
