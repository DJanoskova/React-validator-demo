export default `import React from 'react';

import { useForm } from '../utils/validator';

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
  )
};

export default ResettingForm;`;