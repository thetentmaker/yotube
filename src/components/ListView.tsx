import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TypeListItem from '../model/TypeListItem';
import ListItemView from './ListItemView';

const DUMMY_DATA = [
  {
    title: 'TITLE_01',
    thumbnail: 'https://www.shutterstock.com/shutterstock/photos/2599803593/display_1500/stock-photo-high-angle-view-of-happy-entrepreneur-and-her-colleague-talking-during-business-meeting-in-the-2599803593.jpg',
    publishedAt: '2022-12-18',
    viewCount: 100,
    channelTitle: 'CHANNEL_TITLE_01',
  },
  {
    title: 'TITLE_02',
    thumbnail: 'https://www.shutterstock.com/shutterstock/photos/2591691865/display_1500/stock-vector-lines-with-color-gradient-abstract-vector-d-shapes-wave-design-elements-for-backgrounds-2591691865.jpg',
    publishedAt: '2022-12-18',
    viewCount: 200,
    channelTitle: 'CHANNEL_TITLE_02',
  },
  {
    title: 'TITLE_03',
    thumbnail: 'https://www.shutterstock.com/shutterstock/photos/1444301126/display_1500/stock-photo-beautiful-multi-color-on-white-background-1444301126.jpg',
    publishedAt: '2022-12-18',
    viewCount: 300,
    channelTitle: 'CHANNEL_TITLE_03',
  },
];
const ListView = () => {
  const [list] = useState<TypeListItem[]>(() => DUMMY_DATA);
  return (
    <FlatList
      data={list}
      renderItem={({ item }) => <ListItemView {...item} />}
      keyExtractor={item => item.title}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListView;
