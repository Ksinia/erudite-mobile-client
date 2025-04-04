import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  roomTile: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 0, // Changed from 'auto' for more reliable centering
    alignSelf: 'center', // Center in parent container
    width: width < 420 ? width * 0.9 : 250, // Responsive width
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    // Add shadow for better appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
  },
  tileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: '40%', // Increased from 30%
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from space-evenly
    alignItems: 'center', // Added to center items vertically
    paddingHorizontal: 8, // Added horizontal padding
  },
  tileBody: {
    height: '60%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10, // Increased padding
    paddingHorizontal: 15,
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
  },
  status: {
    fontSize: 14, // Increased from 12
    width: '60%',
    fontWeight: 'bold',
    textAlign: 'center', // Center text
    textAlignVertical: 'center', // Center vertically for Android
  },
  number: {
    width: '15%',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: '2%',
    textAlign: 'center', // Center text
    textAlignVertical: 'center', // Center vertically for Android
  },
  language: {
    width: '20%', // Increased from 15%
    fontSize: 14, // Increased from 12
    fontWeight: 'bold',
    textAlign: 'center', // Center text
    textAlignVertical: 'center', // Center vertically for Android
  },
  counter: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'tomato',
    color: 'white',
    borderRadius: 20,
    minWidth: 20,
    height: 20,
    fontSize: 12,
    textAlign: 'center', // Center text
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: { // Added for the Text inside counter
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  }
});

export default styles;