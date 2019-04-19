import React from 'react';
import './index.css';

import MaterialForm from './examples/MaterialForm';
import CustomForm from './examples/CustomForm';
import ResettingForm from './examples/ResettingForm';
import ErrorsForm from './examples/ErrorsForm';

const App = () => (
  <div className="container">
    <h3>Simple material form</h3>
    <MaterialForm />

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
  </div>
);

export default App;
