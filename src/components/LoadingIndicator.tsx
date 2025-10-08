import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingIndicator = () => {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const styles = StyleSheet.create({
    footer: {
      padding: 10,
      alignItems: 'center',
    },
  });

  export default LoadingIndicator;