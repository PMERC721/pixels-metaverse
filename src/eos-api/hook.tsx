import React, { createContext, ReactNode, useState, useContext, Dispatch } from "react";

export const Web3jsContext = createContext(
  {} as {
    accounts: any;
    contract: any;
    setAccounts: Dispatch<React.SetStateAction<any>>;
    setContract: Dispatch<React.SetStateAction<any>>;
  },
);

export const useWeb3js = () => useContext(Web3jsContext);

export const Web3jsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  return (
    <Web3jsContext.Provider value={{ accounts, contract, setAccounts, setContract }}>
      {children}
    </Web3jsContext.Provider>
  )
}