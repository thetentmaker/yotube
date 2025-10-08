import { View, Text, Image, StyleSheet } from 'react-native';
import TypeListItem from '../model/TypeListItem';

const ListItemView = ({
  thumbnail: uri,
  title,
  publishedAt,
  viewCount,
  channelTitle,
}: TypeListItem) => {
  return (
    <View>
      <Image style={styles.image} source={{ uri }} />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.channelTitle}>
          {channelTitle} • 조회수 {viewCount} • {publishedAt}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
  },
  channelTitle: {
    fontSize: 12,
  },
});

export default ListItemView;
