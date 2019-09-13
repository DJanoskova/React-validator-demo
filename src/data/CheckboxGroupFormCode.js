export default `import React from 'react';

import { useForm } from '../utils/validator';

const CheckboxGroupForm = () => {
  const defaultValues = {
    animals: ['dog', 'cat']
  };

  const { values, useCheckboxGroup, isValid } = useForm(defaultValues);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        My animals:
        <div className="form-checkbox-group">
          <label>
            Dog
            <input
              type="checkbox"
              {...useCheckboxGroup('animals', 'dog')}
            />
          </label>
          <label>
            Cat
            <input
              type="checkbox"
              {...useCheckboxGroup('animals', 'cat')}
            />
          </label>
          <label>
            Guinea pig
            <input
              type="checkbox"
              {...useCheckboxGroup('animals', 'guineapig')}
            />
          </label>
          <label>
            Hamster
            <input
              type="checkbox"
              {...useCheckboxGroup('animals', 'hamster')}
            />
          </label>
        </div>
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  )
};

export default CheckboxGroupForm;`;
