import React from 'react';

import { useForm } from '../utils/validator';

const ErrorsForm = () => {
  const defaultValues = {
    username: '',
    email: '',
    age: ''
  };
  const customErrorAttribute = {
    className: 'has-error'
  };

  const { values, useInput, isValid, errors } = useForm(defaultValues, customErrorAttribute);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-body">
          <label>Username *</label>
          <input
            type="text"
            {...useInput('username', 'isRequired')}
          />

          <label>E-mail *</label>
          <input
            type="text"
            {...useInput('email', 'isEmail, isRequired')}
          />

          <label>Age *</label>
          <input
            type="text"
            {...useInput('age', 'isInt, isRequired')}
          />
        </div>

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>

      <br />

      {!!errors.length && 'Invalid fields:'}
      <ul>
        {errors.map(error => <li key={error}>{error}</li>)}
      </ul>
    </>
  )
};

export default ErrorsForm;