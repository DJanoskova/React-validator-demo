import { useEffect, useState } from 'react';
import validator from 'validator';

export function useFormInput({
  name,
  formHandler,
  validation = '',
  handleError,
  defaultInvalidAttr
}) {
  const [formData, setFormData] = formHandler;
  const formValue = formData[name] || '';

  const [value, setValue] = useState(formValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function handleValidation(value) {
    const unmetRule = validate(value, validation);
    setIsValid(!unmetRule);
    handleError(name, unmetRule);
  }

  // initial validation
  useEffect(() => {
    handleValidation(value);
  }, []);

  // watch for external parent data changes in self
  useEffect(() => {
    if (value !== formValue) {
      setValue(formValue);
      setIsTouched(false);
      setIsFocused(false);
    }
  }, [formValue]);

  // validate on value change
  useEffect(() => {
    handleValidation(value);
  }, [value]);

  // rewrite self and parent's value
  function handleChange({ target }) {
    let { value } = target;

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
  const errorHandler = useState({});
  const [mounted, setMounted] = useState(false);

  const [values, setValues] = formHandler;
  const [errors, setErrors] = errorHandler;

  // initial mounted flag
  useEffect(() => setMounted(true), []);

  const handleError = (name, unmetRule) => {
    if (!unmetRule) delete errors[name];
    else errors[name] = unmetRule;
    setErrors(errors);
  };

  const useInput = (name, validation) =>
    useFormInput({
      name,
      validation,
      formHandler,
      handleError,
      defaultInvalidAttr: invalidAttr
    });

  return {
    values,
    setValues,
    useInput,
    errors,
    isValid: mounted && !Object.values(errors).length
  };
}

/**
 * Returns either unmet rule, or null
 * @param value
 * @param validation
 * @returns {*}
 */
export function validate(value, validation) {
  const fieldsToValidate = {};
  let trimmedValidation;

  switch (typeof validation) {
    case 'object':
      Object.keys(validation).forEach(property => {
        fieldsToValidate[property] = validation[property]
      });
      break;

    case 'string':
    default:
      if (!validation.length) return true;

      trimmedValidation = validation.replace(/ /g, '');
      trimmedValidation.split(',').forEach(fieldName => {
        fieldsToValidate[fieldName.trim()] = true;
      });
  }

  // check whether we do need to validate at all
  const isRequired = fieldsToValidate.isRequired || (fieldsToValidate.isEmpty && fieldsToValidate.isEmpty !== false);
  if (!value && !isRequired) return true;

  let unmetValidationRule = null;
  let isValid = true;

  Object.keys(fieldsToValidate).forEach(rule => {
    // don't proceed if we're already invalid
    if (!isValid) return;

    const options = fieldsToValidate[rule];

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

    if (!isValid) unmetValidationRule = rule;
  });

  return unmetValidationRule || null;
}
