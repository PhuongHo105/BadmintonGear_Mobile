import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import Header from '@/components/ui/header';

export default function HomeScreen() {
  return (
    <View>
      <ThemedView style={styles.container}>
        <Header />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: 15,
    paddingTop: 60,
    position: 'relative',
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

});
