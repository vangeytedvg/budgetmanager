/**
 * IbanField.jsx
 * Returns a component that styles an iban number
 */
import React from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import createIBANMask from "text-mask-addon-iban";

const ibanMask = createIBANMask("BE");

const IbanField = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={ibanMask}
      placeholderChar={"_"}
      showMask
    />
  );
};

IbanField.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default IbanField;
