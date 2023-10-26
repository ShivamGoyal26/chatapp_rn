import {StackActions} from '@react-navigation/native';
import React from 'react';

export const NavigationRef: any = React.createRef();

export function navigate(name: any, params: any) {
  if (NavigationRef.current) {
    NavigationRef.current.navigate(name, params);
  }
}

export function goBack() {
  if (NavigationRef.current) {
    NavigationRef.current.goBack();
  }
}

export function resetRoot(rootName: any) {
  if (NavigationRef.current) {
    NavigationRef.current.resetRoot({
      index: 0,
      routes: [{name: rootName}],
    });
  }
}

export function popToTop() {
  if (NavigationRef.current) {
    NavigationRef.current.dispatch(StackActions.popToTop());
  }
}
