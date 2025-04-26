import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const RevisitWebview = () => (
  <SafeAreaView style={styles.container}>
    <WebView source={{ uri: 'https://americanstruction-pdf.vercel.app/saved' }} />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RevisitWebview;
