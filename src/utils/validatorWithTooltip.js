import { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import dot from 'dot-object';

/** errors outsourced outside of our hooks
 as we don't really need them in the state */
let formErrors = [];

function handleError (name, isValid) {
  if (!isValid) {
    formErrors.push(name);
  } else {
    const index = formErrors.findIndex(error => error === name);
    if (index > -1) formErrors.splice(index, 1);
  }

  formErrors = [...new Set(formErrors)];
}

export function useFormInput ({
  name,
  validation = '',
  tooltip = '',
  values: formData,
  setValues: setFormData,
  defaultInvalidAttr
}) {
  const formValue = dot.pick(name, formData) || '';

  const [value, setValue] = useState(formValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [validationRules] = useState(validation);

  const handleValidation = useCallback(() => {
    const isValid = validate(value, validationRules);
    setIsValid(isValid);
    handleError(name, isValid);
  }, [setIsValid, validationRules, name, value]);

  // watch for external parent data changes
  useEffect(() => {
    if (value !== formValue) {
      setValue(formValue);
      setIsTouched(false);
      setIsFocused(false);
    }
  }, [formValue, value, setValue, setIsFocused, setIsTouched]);

  // validate on value change
  useEffect(() => {
    handleValidation();
  }, [handleValidation, name]);

  // rewrite self and parent's value
  const handleChange = useCallback(({ target }) => {
    const { value, checked, type } = target;
    const newValue = type === 'checkbox' ? checked : value;

    // using dot helps us change nested values
    let data;
    const isNested = name.includes('.');
    if (isNested) {
      dot.override = true;
      data = dot.str(name, newValue, { ...formData });
    }
    else data = { ...formData, [name]: newValue };

    setValue(newValue);
    setFormData(data);
  }, [setValue, formData, setFormData, name]);

  const handleFocus = useCallback(() => {
    setIsTouched(true);
    setIsFocused(true);
    handleValidation();
  }, [setIsTouched, setIsFocused, handleValidation]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  const showError = !isValid && isTouched && !isFocused;
  const invalidAttr = showError ? defaultInvalidAttr : null;

  return {
    value,
    name,
    helperText: isFocused && tooltip ? tooltip : '',
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...invalidAttr
  };
}

export function useForm (defaultValues, invalidAttr = { error: true }) {
  const [values, setValues] = useState(defaultValues);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      formErrors = [];
    };
  }, []);

  const useInput = (name, validation, tooltip) => useFormInput({
    name,
    validation,
    tooltip,
    values,
    setValues,
    defaultInvalidAttr: invalidAttr
  });

  return {
    values,
    setValues,
    useInput,
    errors: formErrors,
    isValid: mounted && !formErrors.length
  };
}

/**
 * Returns either unmet rule, or null
 * @param value
 * @param validation
 * @returns {*}
 */
export function validate (value, validation) {
  const fields = [];

  let trimmedValidation;
  let validatingFields;

  switch (typeof validation) {
    case 'object':
      Object.keys(validation).forEach(property => {
        fields.push({
          rule: property,
          options: validation[property]
        });
      });
      break;

    case 'string':
    default:
      if (!validation.length) return true;
      trimmedValidation = validation.replace(/ /g, '');
      validatingFields = trimmedValidation.split(',');
      validatingFields.forEach(fieldName => {
        fields.push({
          rule: fieldName
        });
      });
  }

  let isValid = true;

  fields.forEach(field => {
    const { rule, options = null } = field;

    switch (rule.trim()) {
      case 'isRequired':
        if (!value) isValid = false;
        break;
      default:
        if (isValid) {
          if (options) isValid = validator[rule](value, options);
          else isValid = validator[rule](value);
        }
        break;
    }
  });

  return isValid;
}
