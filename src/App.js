import React from 'react';
import './index.css';

import MaterialForm from './components/MaterialForm';
import CustomForm from './components/CustomForm';
import ResettingForm from './components/ResettingForm';

const App = () => (
  <div className="container">
    <h3>Simple material form</h3>
    <MaterialForm />
    <hr />
    <h3>Form with custom error class</h3>
    <CustomForm/>
    <h3>Form that resets upon submitting</h3>
    <ResettingForm/>
  </div>
);

export default App;
