import React from 'react';

export const spinnerRef: any = React.createRef();

export const show = () => {
  if (spinnerRef.current) {
    spinnerRef.current.show();
  }
};

export const hide = () => {
  if (spinnerRef.current) {
    spinnerRef.current.hide();
  }
};

const Spinner = {
  show,
  hide,
};

export default Spinner;
