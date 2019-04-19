import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { useForm } from '../utils/validator';
import ToggleCode from '../components/ToggleCode';
import MaterialFormCode from '../data/MaterialFormCode';

const styles = {
  marginTop: {
    marginTop: '1rem'
  }
};

const MaterialForm = ({ classes }) => {
  const { values, useInput, isValid } = useForm({
    username: '',
    email: ''
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log(values)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username *"
          {...useInput('username', 'isRequired')}
        />

        <TextField
          fullWidth
          label="E-mail *"
          className={classes.marginTop}
          {...useInput('email', 'isRequired, isEmail')}
        />

        <Button type="submit"
          disabled={!isValid}
          color="primary"
          className={classes.marginTop}
          variant="contained">
          Submit
        </Button>
      </form>

      <ToggleCode code={MaterialFormCode} />
    </>
  )
};

export default withStyles(styles)(MaterialForm);