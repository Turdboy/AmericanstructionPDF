import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const InspectionWebview = () => (
  <SafeAreaView style={styles.container}>
    <WebView source={{ uri: 'https://americanstruction-pdf.vercel.app/inspection' }} />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default InspectionWebview;
