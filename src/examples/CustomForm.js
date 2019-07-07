import React from 'react';

import { useForm } from '../utils/validator';
import ToggleCode from '../components/ToggleCode';
import CustomFormCode from '../data/CustomFormCode';

const CustomForm = () => {
  const defaultValues = {
    username: '',
    email: '',
    age: ''
  };
  const customErrorAttribute = {
    className: 'has-error',
    'another-attr': 'look-at-me'
  };

  const { values, useInput, isValid } = useForm(defaultValues, customErrorAttribute);

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
            type="text"
            {...useInput('age', {
              isInt: {
                min: 1
              }
            })}
          />
        </div>

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>

      <ToggleCode code={CustomFormCode} />
    </>
  )
};

export default CustomForm;
