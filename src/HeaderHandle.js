import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {BottomSheetHandle, BottomSheetHandleProps} from '@gorhom/bottom-sheet';

const HeaderHandle = ({children, ...rest}) => {
  return (
    <BottomSheetHandle
      style={styles.container}
      indicatorStyle={styles.indicator}
      {...rest}>
      {typeof children === 'string' ? (
        <Text style={styles.title}>{children}</Text>
      ) : (
        children
      )}
    </BottomSheetHandle>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.075)',
    zIndex: 99999,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  indicator: {
    height: 4,
    opacity: 0.5,
  },
});

export default memo(HeaderHandle);
