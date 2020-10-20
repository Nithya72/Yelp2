//Reference - https://medium.com/@tariqul.islam.rony/multiple-checkbox-handling-by-react-js-84b1d49a46c6#:~:text=Today%20i%20build%20some%20example%20about%20multiple%20checkbox%20with%20React%20JS.&text=In%20Figure%201.1%2C%20First%20I,using%20for%20generate%20checkbox%20group.

import React from 'react';

export const CheckBox = props => {
  console.log("CHECKBOX: ", props);
    return (
      <li>
       <input key={props.id} onClick={props.handleCheckBox} type="checkbox" checked={props.isChecked} value={props.value} /> {props.value}
      </li>
    )
}

export default CheckBox