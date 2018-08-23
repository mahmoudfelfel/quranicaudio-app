import { Content, ListItem } from 'native-base';
import formatRecitersByLetter from '../utils/sortNames';
import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NoneFound = styled.Text`
  flex: 1;
  font-size: 20px;
  justify-content: center;
  align-self: center;
  margin-top: 50%;
`;

const Icon = styled(FontAwesome)`
  color: #FFF;
`;

const Text = styled.Text`
  color: ${props => (props.divider ? 'white' : 'black')};
  font-size: 16px;
`;

export default ({ reciters, actions }) => {
  if (reciters.length < 1) {
    return (
      <NoneFound>
        <Icon name="exclamation-triangle" size={25} /> No reciter(s) found.
      </NoneFound>
    );
  }

  const ListOfReciters = () =>
    formatRecitersByLetter(reciters).map(({ letter, reciters }) => {
      if (reciters.length < 1) return false;
      return [<ListItem key={letter} itemDivider style={{ backgroundColor: '#161616' }}>
        <Text divider>
          {letter}
        </Text>
      </ListItem>, reciters.map(reciter =>
        (<ListItem
          key={reciter.id}
          style={{
            marginRight: 10
          }}
          onPress={() => actions.navigate('Chapters', { reciter })}
        >
          <Text>
            {reciter.name}
          </Text>
        </ListItem>)
      )];
    });

  return (
    <Content
      style={{
        backgroundColor: 'white'
      }}
    >
      {ListOfReciters()}
    </Content>
  );
};
