
import zkDID from '@findora/zkdid-js';
import { ZKCircuit } from "@findora/zkdid-js/dist/circuit";
import { ConstraintINT_RNG, ConstraintSTR_RNG } from "@findora/zkdid-js/dist/constraints";
import { createZKCredential, getZKCredential, hasZKCredential, ZKCredential } from "@findora/zkdid-js/dist/credential";
import { generateZKProof, verifyZKProof } from "@findora/zkdid-js/dist/zkproof";
import { KYC_Credential, KYC_Info } from './kyc.schema';
import { createCircuit, hasCircuit } from "@findora/zkdid-js/dist/circuit";


function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getZkUserCircuit() {
  const KYC_AGE_Over_18 = new ConstraintINT_RNG('age', 18, 1000);

  // Credential issuer creates a circuit (and publishes its code) based on above constraints
  const purpose = KYC_Credential.purpose();
  const zkCircuit = new ZKCircuit([KYC_AGE_Over_18]);
  return zkCircuit
}

export function getZkCircuit() {
  const KYC_AGE_Over_18 = new ConstraintINT_RNG('age', 18, 1000);

  const KYC_Mod_Role_range = ['admin', 'mod'];
  const KYC_MOD_ROLE = new ConstraintSTR_RNG('role', KYC_Mod_Role_range);

  // Credential issuer creates a circuit (and publishes its code) based on above constraints
  const purpose = KYC_Credential.purpose();
  const zkCircuit = new ZKCircuit([KYC_MOD_ROLE, KYC_AGE_Over_18]);
  return zkCircuit
}

export const CreateUserZkCredential = (address: string, info: KYC_Info) => {
  if (zkDID.did.hasDID(address) === false) zkDID.did.createDID(address);
  const did = zkDID.did.getDID(address);
  const user = {
    address,
    info,
    kyc: new KYC_Credential(did, info),
  };

  let zkCred;
  if (hasZKCredential(did, KYC_Credential.purpose()) === false)
    zkCred = createZKCredential(user.kyc);
  else zkCred = getZKCredential(did, KYC_Credential.purpose());

  const zkCircuit = getZkCircuit();
  if (false === hasCircuit(KYC_Credential.purpose(), zkCircuit.toCode())) createCircuit(KYC_Credential.purpose(), zkCircuit);

  return zkCred;
};

// KYC credential issuer issues a ZK credential (based on their KYC credential) to each user
// This is what is issued to the user

// verification flow
export async function verifyUserCredential(
  zkCred: ZKCredential,
  zkCircuit: string,
  address: string
) {
  // Verification on each example user
  // User holds his/her ZK credential on hand (The real-world ZK credential can be stored offline or on IPFS).

  // User goes to verifier's (who needs to check the ZK credential) website and generates a ZKProof based on a circuit (specified by verifier)
  const zkProof = await generateZKProof(zkCred, zkCircuit);

  // Verifier checks the ZKProof to see if the user is qualified (born in 20th century AND live in Southeast Asia)
  // Note: `zkProof` probably doesn't know its owner at all. It would be better if DApp uses zkDID.zkproof.verifySignedZKProof to verify the ownership of the `zkProof`.
  const res = verifyZKProof(zkProof, address, KYC_Credential.purpose());

  // The verification result
  return {
    result: res,
    proof: zkProof,
  }
}
