import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

const ToggleCode = ({ code }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!visible);

  return (
    <>
      <Button color="secondary" onClick={toggleVisible}>
        {visible ? 'Hide' : 'Show'} code
      </Button>
      {visible && <pre>{code}</pre>}
    </>
  )
};

export default ToggleCode;