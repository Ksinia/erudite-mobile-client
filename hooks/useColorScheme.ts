// The app is designed light-only (all backgrounds are hardcoded light),
// so the colour scheme is locked to light regardless of the system setting.
// See also "userInterfaceStyle": "light" in app.json, which locks it natively.
export function useColorScheme() {
  return 'light';
}
