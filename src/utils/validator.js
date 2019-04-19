import { useEffect, useState } from 'react';
import validator from 'validator';

export function useFormInput({
  name,
  formHandler,
  validation = '',
  handleError,
  defaultInvalidAttr,
  callback
}) {
  const [formData, setFormData] = formHandler;
  const formValue = formData[name] || '';

  const [value, setValue] = useState(formValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function handleValidation(value) {
    const isValid = validate(value, validation);
    setIsValid(isValid);
    handleError(name, isValid);
  }

  // initial validation
  useEffect(() => {
    handleValidation(value);
  }, []);

  // watch for external parent data changes
  useEffect(() => {
    if (value !== formValue) {
      setValue(formValue);
    }
  }, [formValue]);

  // validate on value change
  useEffect(() => {
    handleValidation(value);
  }, [value]);

  // rewrite self and parent's value
  function handleChange({ target }) {
    let { value } = target;
    if (callback) value = callback(value);
    console.log('c', callback, value)

    setValue(value);
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleFocus = () => {
    if (!isTouched) setIsTouched(true);
    setIsFocused(true);
    handleValidation(value);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showError = !isValid && isTouched && !isFocused;
  const invalidAttr = showError ? defaultInvalidAttr : null;

  return {
    value,
    name,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...invalidAttr
  };
}

export function useForm(defaultValues, invalidAttr = { error: true }) {
  const formHandler = useState(defaultValues);
  const errorHandler = useState([]);
  const [mounted, setMounted] = useState(false);

  const [values, setValues] = formHandler;
  const [errors, setErrors] = errorHandler;

  // initial mounted flag
  useEffect(() => setMounted(true), []);

  const handleError = (name, isValid) => {
    if (!isValid) {
      errors.push(name);
    } else {
      const index = errors.findIndex(error => error === name);
      if (index > -1) errors.splice(index, 1);
    }

    const uniqueErrors = [...new Set(errors)];
    setErrors(uniqueErrors);
  };

  const useInput = (name, validation, callback = null) =>
    useFormInput({
      name,
      validation,
      formHandler,
      handleError,
      callback,
      defaultInvalidAttr: invalidAttr
    });

  return {
    values,
    setValues,
    useInput,
    errors,
    isValid: mounted && !errors.length
  };
}

export function validate(value, validation) {
  const fieldsToValidate = [];
  let trimmedValidation;

  switch (typeof validation) {
    case 'object':
      Object.keys(validation).forEach(property => {
        fieldsToValidate.push({
          rule: property,
          options: validation[property]
        });
      });
      break;

    case 'string':
    default:
      if (!validation.length) return true;

      trimmedValidation = validation.replace(/ /g, '');
      trimmedValidation.split(',').forEach(fieldName => {
        fieldsToValidate.push({
          rule: fieldName.trim()
        });
      });
  }

  let isValid = true;

  for (let i = 0; i < fieldsToValidate.length; i++) {
    const { rule, options = null } = fieldsToValidate[i];

    switch (rule) {
      case 'isRequired':
        if (!value) isValid = false;
        break;

      default:
        switch (options) {
          case true:
          case null:
            isValid = validator[rule](value);
            break;
          case false:
            isValid = !validator[rule](value);
            break;
          default:
            isValid = validator[rule](value, options);
        }
    }

    if (!isValid) break;
  }

  return isValid;
}
