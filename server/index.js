const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes, hexToBytes} = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "046cd5bb1145a0b3754eb615f0b88705f73fcc4c833edea96fbee7d2100eb2cb4a2a1c577b06885480f7f8dc136cd57cd98d536fe399da1660f7947e5776827c60": 100,
  "043269d57f3ffb46c0205e0931c34c668bbfdde992f38f156c3de755f9c93f92bbff0034f690b8b285120c295c7ec247da8e1b6c9ec7ff028f00413d310bce3a81": 50,
  "04d51adb62ce5b76c635dd4dc07c0e3b258717300da41c81dca9750f2663fb21fe31d3ff1ae71d9a3052be9812384a77305d79ded13108984177d6d2a944a467f8": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  let { sender, amount, recipient, messageHash, signature } = req.body;

  console.log(sender,balances[sender]);
  console.log(req.body);
  console.log(hexToBytes(signature));
  console.log(hexToBytes(messageHash));
  console.log(sender);

  const isSigned = secp.verify(hexToBytes(signature), hexToBytes(messageHash), hexToBytes(sender));

  console.log(isSigned);

  if (!isSigned) {
    res.status(400).send({ message: "Not Authorized" });
    return;
  }

  if (sender === recipient) {
    res.status(400).send({ message: "Sender and Recipient are the same" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
