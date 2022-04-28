import { Web3Storage } from "web3.storage";
import { useState } from "react";

const App = () => {
  const [file, setFile] = useState([]);
  const [cid, setCid] = useState("");

  const uploadFile = async () => {
    const storage = new Web3Storage({ token: process.env.REACT_APP_secret });

    const cid = await storage.put(file, {
      onRootCidReady: (localCid) => {
        console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
        console.log("> 📡 sending files to web3.storage ");
      },
      onStoredChunk: (bytes) =>
        console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`),
    });
    console.log(`> ✅ web3.storage now hosting ${cid}`);

    setCid(`https://dweb.link/ipfs/${cid}`);

    console.log("> 📡 fetching the list of all unique uploads on this account");
    let totalBytes = 0;
    for await (const upload of storage.list()) {
      console.log(`> 📄 ${upload.cid}  ${upload.name}`);
      totalBytes += upload.dagSize || 0;
    }
    console.log(`> ⁂ ${totalBytes.toLocaleString()} bytes stored!`);

    console.log(`Uploading file`);
    console.log("Content added with CID:", cid);
  };

  return (
    <div>
      <h1>Web3 Storage</h1>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files)}
        multiple
      />
      <button onClick={uploadFile} disabled={!file}>
        Upload
      </button>
      {cid && (
        <span>
          Congratulations, you file has been uploaded and you can download the
          files from <a href={cid}>{cid}</a>
        </span>
      )}
    </div>
  );
};

export default App;
