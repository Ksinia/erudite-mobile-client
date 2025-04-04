# Erudite React Native Client Commands and Guidelines

## Build/Test/Lint Commands
- Start dev server: `npm start` or `expo start`
- Test: `npm test` (Jest, runs in watch mode)
- Run a single test: `npm test -- -t "test name"` 
- Lint: `npm run lint`
- Reset project: `npm run reset-project`
- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit interfaces/types
- **Imports**: Use absolute imports with `@/` prefix (e.g., `@/components/ThemedText`)
- **Components**: Use functional components with explicit prop types
- **Hooks**: Custom hooks should be prefixed with `use` and have descriptive names
- **State Management**: Use Redux with slice pattern (RTK), combine reducers in index.ts
- **Error Handling**: Capture errors in dedicated error reducer
- **Naming**:
  - Components: PascalCase (e.g., `ThemedText.tsx`)
  - Hooks/utilities: camelCase (e.g., `useThemeColor.ts`)
  - File extensions: `.tsx` for components, `.ts` for non-JSX files
- **Styling**: Use StyleSheet.create() for component styles
- **Testing**: Jest with react-test-renderer for snapshot tests