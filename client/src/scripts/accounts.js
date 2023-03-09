import secp from 'ethereum-cryptography/secp256k1.js';
import { hexToBytes, toHex, utf8ToBytes } from 'ethereum-cryptography/utils.js';


async function accounts () {
    let privateKey = secp.utils.randomPrivateKey();
    console.log(privateKey);
    let publicKey = secp.getPublicKey(privateKey);

    console.log(toHex(privateKey));
    console.log(toHex(publicKey));

}

accounts();