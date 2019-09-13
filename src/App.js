import React from 'react';
import './index.css';

import MaterialForm from './examples/MaterialForm';
import NestedForm from './examples/NestedForm';
import CheckboxGroupForm from './examples/CheckboxGroupForm';
import CustomForm from './examples/CustomForm';
import ResettingForm from './examples/ResettingForm';
import ErrorsForm from './examples/ErrorsForm';
import TooltipForm from './examples/TooltipForm';

const App = () => (
  <div className="container">
    <h3>Simple material form</h3>
    <MaterialForm />

    <h3>Nested values</h3>
    <NestedForm />

    <hr />

    <h3>NEW - Checkbox group</h3>
    <p>
      Use the new function <code>useCheckboxGroup</code> from <code>useForm()</code> - the first argument is the
      property <strong>name</strong> and the second is the checkbox <strong>value</strong>
    </p>
    <CheckboxGroupForm />

    <hr />

    <h3>Form with custom error input class</h3>
    <p>We're adding a <code>.has-error</code> class to the inputs. We're also adding
      a <code>another-attr</code> attribute to show the possibility to add more error attributes.</p>
    <CustomForm />

    <hr />

    <h3>Form that resets upon submitting</h3>
    <p>Also resets <code>is-touched</code> and <code>is-focused</code> input properties</p>
    <ResettingForm />

    <hr />

    <h3>List of invalid fields</h3>
    <ErrorsForm />

    <hr />

    <h3>A demo of enhanced validator that shows helper text on hover</h3>
    <TooltipForm />

    <hr />

    <div className="text-center">
      <a href="https://medium.com/@info_53938/how-i-tried-to-validate-react-forms-with-hooks-31634fc5385b"
        target="_blank"
        className="link"
        rel="noopener noreferrer">
        How I tried to validate React forms (with hooks) at Medium
      </a>
      <br />
      <a href="https://github.com/DJanoskova/React-validator-demo" target="_blank" rel="noopener noreferrer"
        className="link">
        The source code at GitHub
      </a>
    </div>
  </div>
);

export default App;
