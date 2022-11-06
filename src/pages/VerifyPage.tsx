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
import { getZkCircuit, getZkUserCircuit, verifyUserCredential } from '_src/utils/credHelpers';
import moment from 'moment';
import { waitDIDKitMounted } from '@findora/zkdid-js/dist/did';
import '@spruceid/didkit-wasm';
import { getCircuit } from '@findora/zkdid-js/dist/circuit';
import { KYC_Credential } from '_src/utils/kyc.schema';
import { ZKCredential } from '@findora/zkdid-js/dist/credential';

const VerifyPage: React.FC = () => {
  const [address, setAddress] = React.useState<string>('');
  const [zkCredString, setZkCredString] = React.useState<string>('');
  const [zkProofString, setZkProofString] = React.useState<string>('');
  const [zkProofUserString, setZkProofUserString] = React.useState<string>('');
  const [mounted, _mounted] = useState(false);
  useEffect(() => {
    waitDIDKitMounted().then(() => {
      _mounted(true);
    });
  }, []);
  if (!mounted) return null;

  const handleVerifyCredentials = async () => {
    const zkCred: ZKCredential = JSON.parse(JSON.parse(zkCredString));
    const zkCircuit = getZkCircuit();
    const valid = await verifyUserCredential(zkCred, zkCircuit.toCode(), address);
    alert('Credential is valid: ' + valid.result);
    setZkProofString(JSON.stringify(valid.proof));
  };

  const handleVerifyUserCredentials = async () => {
    const zkCred: ZKCredential = JSON.parse(JSON.parse(zkCredString));
    const zkCircuit = getZkUserCircuit();
    const valid = await verifyUserCredential(zkCred, zkCircuit.toCode(), address);
    alert('Credential is valid: ' + valid.result);
    setZkProofUserString(JSON.stringify(valid.proof));
  };

  return (
    <div>
      <h1>VerifyPage</h1>
      <TextField
        id="outlined-basic"
        label="zkCredString"
        variant="outlined"
        value={zkCredString}
        onChange={(e) => setZkCredString(e.target.value)}
      />
      <br />
      <TextField
        id="outlined-basic"
        label="Address"
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button variant="contained" onClick={handleVerifyCredentials}>
        Verify Mod Credentials
      </Button>
      <Button variant="contained" onClick={handleVerifyUserCredentials}>
        Verify User Credentials
      </Button>
      <p>Your proof string for mod: {zkProofString}</p>
      <p>Your proof string for user: {zkProofUserString}</p>
    </div>
  );
};

export { VerifyPage };
