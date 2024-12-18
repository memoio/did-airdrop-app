"use client";
import { useEffect, createContext, useContext, useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

// Create the context
const UserContext = createContext();

// Create the provider component
export const AuthContextProvider = ({ children }) => {
  const { isConnected, address } = useAccount();
  const [userInfo, setUserInfo] = useState(null);
  // const [didInfo, setDidInfo] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      // 调用绑定钱包接口
      const bindWallet = async () => {
        try {
          const response = await axios.post(
            "https://airdrop.7nc.top/api/user/wallet/bind",
            {
              walletAddress: address,
            },
            {
              headers: {
                accept: "application/hal+json",
                uid: "11735283", // 根据您的实际情况传入 uid
                token: "37595d3a6e43876682b37cdcf941938e", // 根据您的实际情况传入 token
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.result === 1) {
            setUserInfo({
              uid: response.data.data.uid,
              token: response.data.data.token,
            });
          } else {
            console.error("Failed to bind wallet:", response.data);
          }
        } catch (error) {
          console.error("Error binding wallet:", error);
        }
      };

      bindWallet();
    }
  }, [isConnected, address]);
  console.log(userInfo);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
