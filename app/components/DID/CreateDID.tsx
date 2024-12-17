import { paytoneOne } from '@/app/ui/fonts';
import Image from 'next/image';
import { useDIDInfo } from "@/app/lib/context/DIDContext";
import axios from 'axios';
import { useAccount, useSignMessage, useChains } from 'wagmi';
import React, { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function CreateDID() {
    const { setIsCreatingDid } = useDIDInfo();
    const { isConnected, address, chain } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { } = useChains();
    // const [network, setNetwork] = useState('none');




    const currentAddress = isConnected && address ? address.slice(0, 6) + '...' + address.slice(-4) : '0x0000...0000'
    const { signMessageAsync } = useSignMessage()

    const url = 'https://didapi.memolabs.org/did'

    const handleCreateDid = async () => {
        if (isConnected) {
            console.log("create")
            try {
                const response = await axios.get(url + `/createsigmsg`, {
                    params: {
                        address,
                    },
                })

                if (response.status === 200) {
                    const message = response.data.msg

                    console.log("message: ", message)
                    const sig = await signMessageAsync({ message });
                    console.log("sig:", sig)

                    const response1 = await axios.post(url + `/create`, {
                        address,
                        sig,
                    });

                    if (response1.status === 200) {
                        setIsCreatingDid();
                    } else {
                        alert(`Error: ${response1.status} - ${response1.statusText}`);
                    }
                }
            } catch (err) {
                console.error('Error creating DID:', err);
            }
        } else {
            if (openConnectModal) {
                openConnectModal();
            }
        }

    };

    return (
        <div className="mt-[40px] flex justify-center bg-dark animate-fade-in">
            <div className="border-[3px] rounded-[11px] px-[38px] py-[26px] bg-gradient-to-r from-[#064E33] to-[#214177] shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div
                    className={`${paytoneOne.className} text-white text-[20px] leading-[30px] animate-slide-down`}
                >
                    Data DID
                </div>
                <div className="rounded-[10px] mt-[25px] px-[5px]">
                    <Image
                        src="/NFT_bg.png"
                        alt="NFT Background"
                        width={483}
                        height={233}
                        className="rounded-md transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="flex justify-between mt-[16px] animate-fade-in-delay">
                    <div className="text-[16px] text-white leading-[30px]">Network</div>
                    <div className="text-[16px] text-white leading-[30px]">{chain ? (chain.name) : ("none")}</div>
                </div>
                <div className="flex justify-between mt-[16px] animate-fade-in-delay">
                    <div className="text-[16px] text-white leading-[30px]">Mint To</div>
                    <div className="text-[16px] text-white leading-[30px]">{address}</div>
                </div>
                <div className="flex justify-between mt-[16px] animate-fade-in-delay">
                    <div className="text-[16px] text-white leading-[30px]">Play With</div>
                    <div className="text-[16px] text-white leading-[30px]">1.00 MEMO</div>
                </div>
                <div className="flex justify-between mt-[16px] animate-fade-in-delay">
                    <div className="text-[16px] text-white leading-[30px]">Total</div>
                    <div className="text-[16px] text-white leading-[30px]">1.00 MEMO + GAS FEE</div>
                </div>
                <div
                    onClick={handleCreateDid}
                    className="w-full py-[9px] text-center text-[16px] rounded-full font-bold bg-[#05F292] mt-[10px] cursor-pointer transform hover:scale-110 transition-transform duration-300 shadow-md"
                >
                    Create
                </div>
                <div
                    className="text-[10px] leading-[30px] text-white mt-[16px] text-center animate-fade-in"
                >
                    Total cost includes gas fees for Smart Account deployment, NFT minting, and future profile upgrades.
                </div>
            </div>
        </div>
    );
}