import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useForm } from '../utils/validatorWithTooltip';

const CustomForm = () => {
  const defaultValues = {
    username: '',
    email: ''
  };

  const { values, useInput, isValid } = useForm(defaultValues);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values)
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="With custom text"
        {...useInput('withCustomText', 'isRequired', 'You\'re focusing me now')}
      />

      <TextField
        label="With custom text 2"
        {...useInput('withCustomText2', 'isRequired', 'And now it\'s me for a change')}
      />

      <br />
      <br />

      <Button type="submit" disabled={!isValid} color="primary" variant="contained">
        Submit
      </Button>
    </form>
  )
};

export default CustomForm;