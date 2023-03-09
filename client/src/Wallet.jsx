import server from "./server";

const key1 = "046cd5bb1145a0b3754eb615f0b88705f73fcc4c833edea96fbee7d2100eb2cb4a2a1c577b06885480f7f8dc136cd57cd98d536fe399da1660f7947e5776827c60";
const key2 = "043269d57f3ffb46c0205e0931c34c668bbfdde992f38f156c3de755f9c93f92bbff0034f690b8b285120c295c7ec247da8e1b6c9ec7ff028f00413d310bce3a81";
const key3 = "04d51adb62ce5b76c635dd4dc07c0e3b258717300da41c81dca9750f2663fb21fe31d3ff1ae71d9a3052be9812384a77305d79ded13108984177d6d2a944a467f8";

function Wallet({ address, setAddress, balance, setBalance }) {
  setAddress(address);
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <select name="wallet" id="wallet" defaultValue={key1} onChange={onChange}>
          <option value="">--Select An Address--</option>
          <option value={key1}>Address 1</option>
          <option value={key2}>Address 2</option>
          <option value={key3}>Address 3</option>
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
