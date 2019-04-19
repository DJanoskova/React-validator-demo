import React from 'react';

import { useForm } from '../utils/validator';
import ToggleCode from '../components/ToggleCode';
import ResettingFormCode from '../data/ResettingFormCode';

const ResettingForm = () => {
  const defaultValues = {
    username: '',
    email: ''
  };
  const customErrorAttribute = {
    className: 'has-error'
  };

  const { values, useInput, isValid, setValues } = useForm(defaultValues, customErrorAttribute);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values);
    setValues({
      username: '',
      email: ''
    })
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

          <label>E-mail *</label>
          <input
            type="text"
            {...useInput('email', 'isEmail, isRequired')}
          />
        </div>

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>

      <ToggleCode code={ResettingFormCode} />
    </>
  )
};

export default ResettingForm;