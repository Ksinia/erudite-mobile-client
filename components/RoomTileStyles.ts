import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  roomTile: {
  borderWidth: 1,
  borderColor: 'lightgrey',
  borderRadius: 5,
  marginVertical: 16,
  marginHorizontal: 1.6,
  // cursor: 'pointer', // Not applicable in React Native
  width: 250,
  height: 120,
  display: 'flex',
  flexDirection: 'column',
  // position: 'relative', // Default in React Native
// hover effects aren't directly applicable in React Native
},
tileHeader: {
  borderBottomWidth: 1,
  borderBottomColor: 'lightgrey',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  height: '30%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
tileHeaderText: {
  margin: 'auto', // Use alignSelf: 'center' in React Native
  alignSelf: 'center',
},
tileBody: {
  height: '60%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingVertical: 1.6,
  paddingHorizontal: 12.8,
},
tileBodyText: {
  margin: 'auto', // Use alignSelf: 'center' in React Native
  alignSelf: 'center',
  overflow: 'hidden',
  // text-overflow: 'ellipsis', // Use numberOfLines and ellipsizeMode in Text component
  fontSize: 14, // 'normal' converted to approximate pixel value
  // word-break: 'keep-all', // Not directly applicable in React Native
},
status: {
  fontSize: 12, // 'small' converted to approximate pixel value
  width: '60%',
  fontWeight: 'bold', // Note: duplicated property in original CSS
},
number: {
  width: '15%',
  fontSize: 18, // 'large' converted to approximate pixel value
  fontWeight: 'bold',
  paddingLeft: '5%',
},
language: {
  width: '15%',
  fontSize: 12, // 'small' converted to approximate pixel value
  fontWeight: 'bold',
  paddingLeft: '5%',
},
counter: {
  position: 'absolute',
  top: -12.8, // Converted from -0.8em
  right: -12.8, // Converted from -0.8em
  backgroundColor: 'tomato',
  color: 'white',
  borderRadius: 20,
  // width: 'fit-content', // Not applicable in React Native
  minWidth: 20,
  height: 20,
  fontSize: 12, // 'small' converted to approximate pixel value
  lineHeight: 16, // Converted from 1em
  padding: 3,
  // box-sizing: 'border-box', // Default in React Native
},
});

// Media query equivalent using Dimensions
// You would conditionally apply these styles in your component
   const responsiveStyles = StyleSheet.create({
  roomTileResponsive: {
  width: width < 420 ? width * 0.9 : 250, // 90vw when width < 420px
},
});

export default styles;