import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { key1, key2, key3} from "./assets";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState(key1);
  const [sender, setSender] = useState(key1);
  const [signer, setSigner] = useState(key1);

  console.log(secp);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let messageHash = keccak256(Uint8Array.from("hello"));
    //console.log(signer);
    //console.log(messageHash);
    const signature = await secp.sign(messageHash, signer);
    const isSigned = secp.verify(signature, messageHash, secp.getPublicKey(sender));
    //console.log(isSigned);
    //console.log(signature);
    //console.log(messageHash);
    //console.log(secp.getPublicKey(sender));
    //console.log(toHex(secp.getPublicKey(sender)));
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: toHex(secp.getPublicKey(sender)),
        amount: parseInt(sendAmount),
        recipient: toHex(secp.getPublicKey(recipient)),
        messageHash: toHex(messageHash),
        signature: toHex(signature)
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Signer
        <select name="signer" id="signer" onChange={setValue(setSigner)}>
          <option value={key1}>Address 1</option>
          <option value={key2}>Address 2</option>
          <option value={key3}>Address 3</option>
        </select>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Sender Wallet
        <select name="sender" id="sender" onChange={setValue(setSender)}>
          <option value={key1}>Address 1</option>
          <option value={key2}>Address 2</option>
          <option value={key3}>Address 3</option>
        </select>
      </label>

      <label>
        Recipient Wallet
        <select name="sender" id="sender" onChange={setValue(setRecipient)}>
          <option value={key1}>Address 1</option>
          <option value={key2}>Address 2</option>
          <option value={key3}>Address 3</option>
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
