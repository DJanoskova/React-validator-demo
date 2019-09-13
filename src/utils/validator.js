import { useEffect, useState, useCallback } from 'react';
import validator from 'validator';
import dot from 'dot-object';

export function useFormInput({
  name,
  validation = '',
  values: formData,
  setValues: setFormData,
  defaultInvalidAttr,
  handleError
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
  }, [setIsValid, validationRules, name, value, handleError]);

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
    } else data = { ...formData, [name]: newValue };

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
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...invalidAttr
  };
}

export function useFormCheckboxGroup({
  name,
  value,
  values: formData,
  setValues: setFormData
}) {
  const formValue = dot.pick(name, formData) || [];
  const hasValue = formValue.indexOf(value) > -1;

  const [checked, setChecked] = useState(hasValue);

  // watch for external parent data changes
  useEffect(() => {
    const isChecked = formValue.indexOf(value) > -1;
    setChecked(isChecked)
  }, [formValue, value]);

  // rewrite self and parent's value
  const handleChange = useCallback(({ target }) => {
    const oldValue = dot.pick(name, formData) || [];
    const { checked } = target;
    let newValue;

    const index = oldValue.indexOf(value);
    if (checked && index < 0) {
      newValue = [...oldValue, value]
    } else if (!checked && index > -1) {
      newValue = oldValue.filter(v => v !== value);
    }

    // using dot helps us change nested values
    let data;
    const isNested = name.includes('.');
    if (isNested) {
      dot.override = true;
      data = dot.str(name, newValue, { ...formData });
    } else {
      data = { ...formData, [name]: newValue };
    }

    setChecked(checked);
    setFormData(data);
  }, [value, formData, setFormData, name]);

  return {
    name,
    checked,
    onChange: handleChange
  };
}

export function useForm(defaultValues, invalidAttr = { error: true }) {
  const [values, setValues] = useState(defaultValues);
  const [mounted, setMounted] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleError = useCallback((name, isValid) => {
    let errors = formErrors;
    const index = errors.findIndex(error => error === name);

    if (!isValid) {
      if (index < 0) errors.push(name);
    } else {
      if (index > -1) errors.splice(index, 1);
    }

    setFormErrors(errors);
  }, [formErrors]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useInput = (name, validation) => useFormInput({
    name,
    validation,
    values,
    setValues,
    defaultInvalidAttr: invalidAttr,
    handleError
  });

  const useCheckboxGroup = (name, value) => useFormCheckboxGroup({ name, values, setValues, value });

  return {
    values,
    setValues,
    useInput,
    useCheckboxGroup,
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
export function validate(value, validation) {
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
    const { rule, options = null } = field

    switch (rule.trim()) {
      case 'isRequired':
        if (!value) isValid = false
        break
      default:
        if (isValid) {
          if (options !== null) {
            let result
            switch (options) {
              case true:
                result = validator[rule](value);
                break
              case false:
                result = !validator[rule](value);
                break
              default:
                result = validator[rule](value, options);
            }
            isValid = result
          } else isValid = validator[rule](value);
          break
        }
    }
  });

  return isValid;
}
