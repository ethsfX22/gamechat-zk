import { createZKCredential, getZKCredential, hasZKCredential, ICredential, ZKCredential } from "@findora/zkdid-js/dist/credential";
import { Base64 } from "js-base64";
import { DID } from "@findora/zkdid-js/dist/types";
import { stringKeccak256 } from "@findora/zkdid-js/dist/lib/tool";

interface KYC_Info {
  age: number;
  name: string;
  role: string;
}

// A custom credential for KYC
class KYC_Credential extends ICredential {
  private info: KYC_Info;

  constructor(did: DID, info: KYC_Info) {
    super(did);
    this.info = info;
  }
  static issuer(): string {
    return 'my.biteria.org';
  }
  static purpose(): string {
    return stringKeccak256(`${this.issuer()}.kyc-info`);
  }
  getInfo() {
    return this.info;
  }
  getIssuer(): string {
    return KYC_Credential.issuer();
  }
  getPurpose(): string {
    return KYC_Credential.purpose();
  }
  getEncrypted(): string {
    const ObjectOfthis = {
      did: this.getDID(),
      age: this.info.age,
      name: this.info.name,
      role: this.info.role,
    };
    // Base64 encoding is now REQUIRED to make proof verification working
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}

export { KYC_Credential };
export type { KYC_Info };
