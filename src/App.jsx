import abi from '../utils/Coffee.json';
import { ethers } from "ethers";

import React, { useEffect, useState } from "react";

function App() {
  // Contract Address & ABI
  const contractAddress = "0x043dF69FAe188fA4516A0E5cA0FA1c126d009FC4";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState()

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        setLoading(true)
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");
        setLoading(false);

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);
  return (
    <>
      <div >
        <div className="text-3xl font-bold underline">
          <title>Buy Anurag a Coffee!</title>
          <meta name="description" content="Tipping site" />
          <link rel="icon" href="/favicon.ico" />
        </div>


        <div className=' flex items-center justify-center bg-yellow-500 p-6 space-x-8'>
          <div>
            {
              loading === true ? (
                <div className='font-bold font-serif text-xl'>Loading kindly wait!!</div>
              ) : (
                <div className='bg-red-900 invisible'>Completed</div>
              )
            }
          </div>
          <h1 className='font-bold font-serif text-xl'>
            Buy Anurag a Coffee!!!
          </h1>
        </div>


        <main className=' items-center justify-center flex flex-col py-4 bg-yellow-200 space-y-8'>
          <img src="https://cdn.iconscout.com/icon/free/png-256/buymeacoffee-3629258-3030568.png"
            className='h-60 w-60'
            alt="" />
          {currentAccount ? (
            <div>
              <form>
                <div>
                  <label>
                    Name
                  </label>
                  <br />
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className='rounded-xl  bg-transparent border border-yellow-500 px-2 py-1'
                    onChange={onNameChange}
                  />
                </div>
                <br />
                <div>
                  <label>
                    Send Anurag a message
                  </label>
                  <br />

                  <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    className='rounded-xl  bg-transparent border border-yellow-500 px-2 py-1'
                    required
                  >
                  </textarea>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={buyCoffee}
                    className=" px-2 py-1 rounded-lg bg-yellow-500 mt-3"
                  >
                    Send 1 Coffee for 0.001ETH
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={connectWallet} className='rounded-xl  bg-transparent border border-yellow-500 px-2 py-1'> Connect your wallet </button>
          )}
        </main>

        <div className='bg-yellow-200 flex items-center justify-center font-bold font-serif text-xl'>

          {currentAccount && (<h1>Memos received</h1>)}
        </div>

        {currentAccount && (memos.map((memo, idx) => {
          return (

            <div className=' p-8 bg-yellow-200'>
              <div key={idx} style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px" }}>
                <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
                <p>From: {memo.name} at {memo.timestamp.toString()}</p>
              </div>
            </div>
          )
        }))}

        <footer className='bg-yellow-200 flex items-center justify-center font-bold font-serif text-xl '>
          <div >
            <a
              href="https://portfolioanurag.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Created by Anurag
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
