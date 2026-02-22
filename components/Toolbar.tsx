import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useSelector } from 'react-redux';

import { logOutAndClearStorage } from "@/reducer/auth";
import { RootState } from "@/reducer";
import { enterLobby } from "@/reducer/outgoingMessages";
import TranslationContainer from './Translation/TranslationContainer';
import LangSwitchContainer from "@/components/LangSwitchContainer";
import { useAppDispatch } from "@/hooks/redux";

const Toolbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const isOverflowing = contentWidth > containerWidth && containerWidth > 0;

  const handleLogout = () => {
    dispatch(logOutAndClearStorage());
    setMenuOpen(false);
    router.replace('/');
  };

  const navigateTo = (path: Href) => {
    setMenuOpen(false);
    router.push(path);
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const onSizerLayout = (e: LayoutChangeEvent) => {
    setContentWidth(e.nativeEvent.layout.width);
  };

  const renderAllNavItems = (onNavigate?: (path: Href) => void) => (
    <>
      <View style={styles.navItem}>
        <LangSwitchContainer />
      </View>

      <Pressable
        style={styles.navItem}
        onPress={() => {
          dispatch(enterLobby());
          (onNavigate || navigateTo)('/' as Href);
        }}
      >
        <Text style={styles.navText}>
          <TranslationContainer translationKey="toolbar_list" />
        </Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => (onNavigate || navigateTo)('/rules' as Href)}>
        <Text style={styles.navText}>
          <TranslationContainer translationKey="toolbar_rules" />
        </Text>
      </Pressable>

      {!user ? (
        <>
          <Pressable style={styles.navItem} onPress={() => (onNavigate || navigateTo)('/signup' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="sign_up" />
            </Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => (onNavigate || navigateTo)('/login' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="log_in" />
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable style={styles.navItem} onPress={() => (onNavigate || navigateTo)('/user' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="welcome" /> {user.name}!
            </Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={handleLogout}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="log_out" />
            </Text>
          </Pressable>
        </>
      )}
    </>
  );

  const renderBurgerMenuItems = () => (
    <>
      <Pressable style={styles.menuItem} onPress={() => navigateTo('/rules' as Href)}>
        <Text style={styles.navText}>
          <TranslationContainer translationKey="toolbar_rules" />
        </Text>
      </Pressable>

      {!user ? (
        <>
          <Pressable style={styles.menuItem} onPress={() => navigateTo('/signup' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="sign_up" />
            </Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => navigateTo('/login' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="log_in" />
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable style={styles.menuItem} onPress={() => navigateTo('/user' as Href)}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="welcome" /> {user.name}!
            </Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.navText}>
              <TranslationContainer translationKey="log_out" />
            </Text>
          </Pressable>
        </>
      )}
    </>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.sizer} onLayout={onSizerLayout} pointerEvents="none">
        {renderAllNavItems()}
      </View>

      <View style={styles.container} onLayout={onContainerLayout}>
        {!isOverflowing ? (
          renderAllNavItems()
        ) : (
          <>
            <View style={styles.navItem}>
              <LangSwitchContainer />
            </View>

            <Pressable
              style={styles.navItem}
              onPress={() => {
                dispatch(enterLobby());
                navigateTo('/' as Href);
              }}
            >
              <Text style={styles.navText}>
                <TranslationContainer translationKey="toolbar_list" />
              </Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => setMenuOpen(!menuOpen)}>
              <Text style={styles.burgerText}>&#9776;</Text>
            </Pressable>
          </>
        )}
      </View>
      <View style={styles.borderBottom} />
      {isOverflowing && menuOpen && (
        <View style={styles.menu}>
          {renderBurgerMenuItems()}
          <View style={styles.borderBottom} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 999,
  },
  sizer: {
    position: 'absolute',
    flexDirection: 'row',
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    height: 30,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  navItem: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    height: '100%',
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
  burgerText: {
    fontSize: 16,
    color: '#333',
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  menu: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});

export default Toolbar;
