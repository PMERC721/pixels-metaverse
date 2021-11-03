import React, { createContext, ReactNode, useState, useContext, Dispatch, useCallback } from "react";
import Web3 from "web3";

export const Web3jsContext = createContext(
  {} as {
    web3?: Web3;
    setWeb3: Dispatch<React.SetStateAction<Web3 | undefined>>;
  },
);

export const useWeb3js = () => useContext(Web3jsContext);

export const Web3jsProvider = ({ children }: { children: ReactNode }) => {
  const [web3, setWeb3] = useState<Web3>();

  return (
    <Web3jsContext.Provider value={{ web3, setWeb3 }}>
      {children}
    </Web3jsContext.Provider>
  )
}

export const useMyWeb3 = () => {
  return useCallback(() => new Promise<Web3>((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  }), [])
}