import { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ListItemView from './ListItemView';
import useYotubeData from '../hooks/useYotubeData';

const ListView = () => {
  const { data, loadData, loadMoreData } = useYotubeData();
  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItemView {...item} />}
      keyExtractor={item => item.title}
      style={styles.container}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListView;
