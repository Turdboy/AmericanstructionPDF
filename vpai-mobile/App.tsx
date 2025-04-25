import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import MobileLandingPage from './components/MobileLandingPage'; // adjust path if needed


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
<WebView source={{ uri: 'https://americanstruction-pdf.vercel.app/mobile' }} />
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
