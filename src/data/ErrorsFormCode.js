export default `import React from 'react';

import { useForm } from '../utils/validator';

const ErrorsForm = () => {
  const defaultValues = {
    username: '',
    email: '',
    age: '',
    password: '',
    passwordVerification: ''
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

        <label>Username *</label>
        <input
          type="text"
          {...useInput('username', 'isRequired')}
        />
        {errors.username && <span>Username is required</span>}

        <label>E-mail *</label>
        <input
          type="text"
          {...useInput('email', 'isEmail, isRequired')}
        />

        <label>Age *</label>
        <input
          type="text"
          {...useInput('age', {
            isInt: {
              min: 1
            },
            isRequired: true
          })}
        />

        <label>Password * <span className="small">min. 6 characters</span></label>
        <input
          type="password"
          {...useInput('password', {
            isRequired: true,
            isLength: {
              min: 6
            }
          })}
        />

        <label>Password verification</label>
        <input
          type="password"
          {...useInput('passwordVerification', {
            isRequired: true,
            equals: values.password
          })}
        />

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>

      <br />

      You can check the errors object and the unmet criteria to create custom validation messages. Fill the form and
      check how errors change.

      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </>
  )
};

export default ErrorsForm;`;