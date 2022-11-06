import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { CreateUserZkCredential } from '_src/utils/credHelpers';
import moment from 'moment';
import { waitDIDKitMounted } from '@findora/zkdid-js/dist/did';
import '@spruceid/didkit-wasm';

const IssuePage: React.FC = () => {
  const [value, setValue] = React.useState<moment.Moment | null>(null);
  const [address, setAddress] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [role, setRole] = React.useState<'admin' | 'mod' | 'user'>('user');
  const [mounted, _mounted] = useState(false);
  useEffect(() => {
    waitDIDKitMounted().then(() => {
      _mounted(true);
    });
  }, []);
  if (!mounted) return null;

  const handleRoleChange = (event: SelectChangeEvent) => {
    const userRole = event.target.value as 'admin' | 'mod' | 'user';
    setRole(userRole);
  };

  const handleIssueCredentials = () => {
    const zkCred = CreateUserZkCredential(address, {
      name,
      role,
      age: moment().year() - value.year(),
    });
    console.log('Created credential: ', zkCred);
  };

  return (
    <div>
      <h1>IssuePage</h1>
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <TextField
        id="outlined-basic"
        label="Address"
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Age</InputLabel>
        <Select labelId="demo-select-small" id="demo-select-small" value={role} label="Age" onChange={handleRoleChange}>
          <MenuItem value={'user'}>User</MenuItem>
          <MenuItem value={'admin'}>Admin</MenuItem>
          <MenuItem value={'mod'}>Mod</MenuItem>
        </Select>
      </FormControl>
      <br />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="Pick date of birth"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <br />
      <Button variant="contained" onClick={handleIssueCredentials}>
        Issue Credentials
      </Button>
    </div>
  );
};

export { IssuePage };
