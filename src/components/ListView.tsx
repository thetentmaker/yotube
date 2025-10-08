import { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ListItemView from './ListItemView';
import useYotubeData from '../hooks/useYotubeData';
import LoadingIndicator from './LoadingIndicator';

const ListView = () => {
  const { data, loadData, loadMoreData, isLoading } = useYotubeData();
  useEffect(() => {
    loadData();
  }, [loadData]);
  const loadingIndicator = isLoading ? <LoadingIndicator /> : null;
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItemView {...item} />}
      keyExtractor={item => item.id}
      style={styles.container}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
      ListFooterComponent={loadingIndicator}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default ListView;
