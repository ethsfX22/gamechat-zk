import { createCircuit, getCircuit, hasCircuit, ZKCircuit } from '@findora/zkdid-js/dist/circuit';
import { ConstraintINT_RNG, ConstraintSTR_RNG } from '@findora/zkdid-js/dist/constraints';
import { waitDIDKitMounted } from '@findora/zkdid-js/dist/did';
import Button from '@mui/material/Button';
import '@spruceid/didkit-wasm';
import React, { useEffect, useState } from 'react';
import { KYC_Credential } from '../utils/kyc.schema';

const CircuitCheck: React.FC = () => {
  const putCircuit = () => {
    const KYC_AGE_Over_18 = new ConstraintINT_RNG('age', 18, 1000);

    const KYC_Mod_Role_range = ['admin', 'mod'];
    const KYC_MOD_ROLE = new ConstraintSTR_RNG('role', KYC_Mod_Role_range);

    // Credential issuer creates a circuit (and publishes its code) based on above constraints
    const purpose = KYC_Credential.purpose();
    const zkCircuit = new ZKCircuit([KYC_AGE_Over_18, KYC_MOD_ROLE]);
    const code = zkCircuit.toCode();
    if (false === hasCircuit(purpose, zkCircuit.toCode())) createCircuit(purpose, zkCircuit);
    console.log('put circuit: ', code);
  };

  const checkCircuit = () => {
    try {
      const KYC_AGE_Over_18 = new ConstraintINT_RNG('age', 18, 1000);

      const KYC_Mod_Role_range = ['admin', 'mod'];
      // const KYC_MOD_ROLE = new ConstraintSTR_RNG('role', KYC_Mod_Role_range);

      // Credential issuer creates a circuit (and publishes its code) based on above constraints
      const purpose = KYC_Credential.purpose();
      const zkCircuit = new ZKCircuit([KYC_AGE_Over_18]);
      const code = zkCircuit.toCode();

      const circuit = getCircuit(purpose, code);
      console.log('got circuit', circuit);
      console.log('Circuit match: ', circuit.toCode() === code);
    } catch (error) {
      console.log("didn't get circuit", error);
    }
  };

  const [mounted, _mounted] = useState(false);
  useEffect(() => {
    waitDIDKitMounted().then(() => {
      _mounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <h1>Circuit Check</h1>
      <br />
      <Button variant="contained" onClick={putCircuit}>
        Put Circuit
      </Button>
      <br />
      <Button variant="contained" onClick={checkCircuit}>
        Check Circuit
      </Button>
    </div>
  );
};

export { CircuitCheck };
