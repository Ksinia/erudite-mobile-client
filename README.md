# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the app on iPhone simulator

   ```bash
   npm run ios
   ```

   This command will:
   - Create a development build
   - Install it on the iPhone simulator
   - Start the development server

Alternatively, you can start the development server and choose your device:

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Implementation Plan for Game Functionality

The following outlines the plan to implement the game functionality from the web client in the React Native app:

### 1. Component Structure

```
GameScreen (app/(tabs)/game/[id]/index.tsx)
└── GameContainer
    └── Game
        ├── Board
        ├── Letters
        ├── Controls
        ├── WildCardForm
        └── Results
```

### 2. Component Implementation Phases

#### Phase 1: Basic Component Structure and State Management

1. **GameContainer Component**
   - Port class component to functional component with hooks
   - Implement core state management (userLetters, userBoard, chosenLetterIndex)
   - Convert array manipulation functions (arrayDifference, getPreviousLetters)
   - Set up useEffect hooks for game state updates

2. **Game Component**
   - Create responsive layout for React Native
   - Split complex render logic into smaller components
   - Adapt CSS styles to React Native style objects

3. **Board Component**
   - Convert table-based layout to grid using FlexBox or FlatList
   - Implement cell rendering with proper styling
   - Adapt onClick handlers to React Native touch events

#### Phase 2: Game Interaction Features

4. **Letters Component**
   - Implement draggable letters UI (using React Native Gesture Handler)
   - Handle letter selection and placement
   - Visualize letter values and selection state

5. **Controls Component**
   - Implement game action buttons (confirm, return, undo, pass)
   - Create scoring display and turn information area
   - Add game phase indicators

6. **WildCardForm Component**
   - Create a React Native picker for wildcard letter selection
   - Adapt form validation logic

#### Phase 3: Advanced Game Features

7. **Results Component**
   - Implement game results display
   - Create score table with player information
   - Add turn history view

8. **Thunk Actions**
   - Port turn.ts, game.ts and other thunk actions
   - Adapt network requests for React Native environment
   - Ensure proper error handling

9. **Game Logic**
   - Implement letter placement validation
   - Adapt word scoring and game flow logic
   - Handle game phase transitions

### 3. Technical Considerations

1. **Touch Interactions vs Mouse Events**
   - Replace all mouse event handlers with touch events
   - Implement drag and drop using React Native Gesture Handler or Reanimated

2. **Layout Adaptations**
   - Make the board responsive to different screen sizes
   - Use FlexBox for layouts instead of CSS Grid
   - Consider portrait/landscape orientations

3. **Performance Optimizations**
   - Use memoization for complex calculations
   - Implement useCallback for frequently used functions
   - Leverage React Native's FlatList for efficient rendering of large lists

4. **Accessibility**
   - Ensure proper accessibility labels for all interactive elements
   - Support dynamic text sizing
   - Maintain proper contrast ratios

### 4. Testing Strategy

1. **Component Testing**
   - Unit tests for core game logic functions
   - Component rendering tests 

2. **Integration Testing**
   - Test game flow through different phases
   - Test network requests and socket communication

3. **Manual Testing**
   - Test on different device sizes
   - Verify touch interactions work as expected
   - Validate game rules are enforced correctly

### 5. Migration Challenges

1. **CSS to StyleSheet**
   - Web CSS classes need to be converted to React Native StyleSheet objects
   - Animations need to be reimplemented using Animated API

2. **DOM Manipulation**
   - Replace any direct DOM manipulation with React state updates
   - Replace HTML event handling with React Native's touch system

3. **Layout Differences**
   - Web table-based board layout needs to be reimplemented with flexbox
   - Responsive design needs to consider mobile-specific constraints

4. **Redux Integration**
   - Ensure Redux patterns work consistently between platforms
   - Adapt thunk actions for React Native environment

### Timeline Estimation

1. **Phase 1: Basic Structure** - 2 weeks
2. **Phase 2: Game Interactions** - 3 weeks
3. **Phase 3: Advanced Features** - 2 weeks
4. **Testing and Refinement** - 1 week

Total estimated implementation time: 8 weeks
