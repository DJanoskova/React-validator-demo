import React from 'react';

import { useForm } from '../utils/validator';

const CustomForm = () => {
  const defaultValues = {
    username: '',
    email: '',
    age: null
  };
  const customErrorAttribute = {
    className: 'has-error'
  };

  const { values, useInput, isValid } = useForm(defaultValues, customErrorAttribute);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-body">
        <label>Username *</label>
        <input
          type="text"
          {...useInput('username', {
            isRequired: true
          })}
        />

        <label>E-mail</label>
        <input
          type="text"
          {...useInput('email', 'isEmail')}
        />

        <label>Age</label>
        <input
          type="number"
          {...useInput('age', 'isInt')}
        />
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  )
};

export default CustomForm;