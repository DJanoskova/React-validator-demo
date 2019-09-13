import React from 'react';

import { useForm } from '../utils/validator';
import ToggleCode from '../components/ToggleCode';
import CheckboxGroupFormCode from '../data/CheckboxGroupFormCode';

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
    <>
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

      <pre>{JSON.stringify(values, null, 2)}</pre>

      <ToggleCode code={CheckboxGroupFormCode} />
    </>
  )
};

export default CheckboxGroupForm;
