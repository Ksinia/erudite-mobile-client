import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  roomTile: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
    width: width < 420 ? width * 0.9 : 250,
    height: 120,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tileBody: {
    height: '60%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 30,
    marginRight: 6,
  },
  status: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  language: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 6,
  },
  counter: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'tomato',
    borderRadius: 20,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default styles;
