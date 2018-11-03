import styled from 'styled-components/native';
import * as Utils from '../utils/audio';
import { Linking, FlatList } from 'react-native';
import { ListItem } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { isSelectedSurah } from '../utils';

const Duration = styled.Text`
  text-align: right;
  width: 33%;
`;

const Read = styled.Text`
  width: 33%;
  background: white;
  border: 1px solid #2ca4ab;
  border-radius: 10px;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding-top: 3px;
`;

const Text = styled.Text`flex-grow: 1;`;
const ItemContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Icon = styled(FontAwesome)`
  color: #2CA4AB;
`;

const NoneFound = styled.Text`
  flex: 1;
  font-size: 20px;
  justify-content: center;
  align-self: center;
  margin-top: 50%;
`;

export default (props) => {
  if (props.chapters.length < 1) {
    return (
      <NoneFound>
        <Icon name="exclamation-triangle" size={25} /> No chapter(s) found.
      </NoneFound>
    );
  }
  const Chapter = (chapter, file) => {
    const shouldHighlightRow = isSelectedSurah(file, props.selectedSurah);
    const duration = file ? Utils.secondTime(file.format.duration) : '00:00';
    return (
      <ListItem
        style={{
          backgroundColor: shouldHighlightRow ? '#ddd' : 'transparent',
          marginRight: 0,
          marginLeft: 0,
          paddingright: 10,
          paddingLeft: 10,
        }}
        key={`file_${file.surah_id}`}
        onPress={() =>
          props.actions.selectChapter({
            reciter: props.reciter,
            chapter: chapter.id
          })}
      >
        <ItemContainer>
          <Text>
            {chapter && chapter.name.simple}
          </Text>
          <Read
            onPress={() =>
              Linking.openURL(`https://www.quran.com/${chapter.id}`)}
          >
            {' '}<Icon name="book" /> Read{' '}
          </Read>
          <Duration>
            {duration}
          </Duration>
        </ItemContainer>
      </ListItem>
    );
  };

  return (
    <FlatList
      data={props.files} // iterating over files to make sure we won't have any chapters without audio files
      renderItem={({ item }) => Chapter(props.chapters[item.surah_id - 1], item)}
    />
  );
};
