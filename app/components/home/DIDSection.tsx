'use client';

import React, { FC } from 'react';
import { paytoneOne } from '@/app/ui/fonts';
import Image from 'next/image';
import { useDIDInfo } from "@/app/lib/context/DIDContext";
import axios, { AxiosError } from 'axios';
import { useAccount } from "wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { API_URL } from '../config/config';
import { useAuth } from '@/app/lib/context/AuthContext';
import { useAction } from '@/app/lib/context/ActionContext';
interface PopupData {
    invitee: string;
    time: string;
    points: number;
}

export default function DidSection() {
    const { isCheckDID, setIsCheckDID } = useAction();
    const { address, isConnected, isDisconnected } = useAccount();
    const { setToggleDid, didInfo, isDIDExistState, } = useDIDInfo();
    const { openConnectModal } = useConnectModal();
    const [popupData, setPopupData] = useState<PopupData[]>([]);
    const [showPopup, setShowPopup] = useState(false);



    const openDid = async () => {
        window.open(`http://faucet.metamemo.one?address=${address}`, '_blank')
        const actionId = 2;
        const respond = await axios.post(API_URL.BACKEND_AIRDROP_RECORD_ADD, {
            "actionid": actionId,
            "address": address
        });

        if (respond.status === 200) {
            if (respond.data.result === 1) {
                setIsCheckDID(true)
            } else {
                alert(respond.data.error)
            }
        }
    };



    useEffect(() => {

    })

    const closePopup = () => setShowPopup(false);

    const [buttonText, setButtonText] = useState("Check DID");

    const handleClick = () => {
        if (isCheckDID) {
          setButtonText("You Have Already Checked");
          setTimeout(() => {
            setButtonText("Check DID");
          }, 3000);
        } else {
          openDid();
        }
      };

    return (
        <div className="relative">
            {/* Main content */}
            <div className="flex flex-col md:flex-row justify-center items-center w-full h-auto mb-[80px]">
                {/* Left Section */}
                <div className="flex flex-col w-full  px-[20px] md:px-[0px]">
                    <div
                        className={`${paytoneOne.className} text-white text-[28px] sm:text-[28px] md:text-[32px] lg:text-[40px] xl:text-[48px] leading-tight text-center sm:text-left`}
                    >
                        <span className="text-white">Data</span> <span>DID</span>
                    </div>
                    <div className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[23px] leading-7 mt-[15px] text-left sm:text-left">
                        Your all-in-one, privacy-preserving self-sovereign identity.Own, manage, and monetize your data!
                    </div>
                    <div className="text-white text-[12px] sm:text-[14px] text-left sm:text-left">
                        <p className='mt-[15px]'>Check DID, you need to click the <a className="text-[#13E292] cursor-pointer" onClick={() => window.open(`http://faucet.metamemo.one?address=${address}`, '_blank')}>faucet button</a> to get the gas fee.</p>
                        <p className='mt-[15px]'>Note 1: Users need to create did before participating in earning points. </p>
                        <p className='mt-[15px]'>Note 2: Create DID +1000, Check DID +500.</p>
                    </div>
                    <div className="text-center flex justify-start sm:justify-start">
                        {isDIDExistState && isConnected ? (
                            <div className="mt-[5px] px-[5px] bg-[#121212] ">
                                <div className="text-[18px] text-[#13E292] mt-[16px] text-left">
                                    No.{didInfo.number}
                                </div>
                                <div className="text-[12px] text-[#13E292]">
                                    {didInfo.did.slice(0, 18) + "..." + didInfo.did.slice(-18)}
                                </div>
                                <div className='flex flex-row gap-5'>
                                    <div
                                        onClick={handleClick}
                                        className={`bg-[#13E292] flex justify-center items-center rounded-full px-4 py-2 mt-5 shadow-md transform hover:scale-110 transition-transform duration-300 cursor-pointer 
                                            ${isCheckDID ? 'opacity-50 cursor-not-allowed' : console.log("ischeck", isCheckDID)}`}
                                    >
                                        <span className="font-bold text-[14px] sm:text-[16px] text-white">
                                            {buttonText}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div></div>
                        )}

                    </div>
                </div>

                {/* Right Section (Images) */}
                <div className="flex w-full flex-col mt-[50px] xl:mt-[0px] px-[20px] md:px-[0px]">
                    <Image
                        src="/NFT_bg.png"
                        width={777}
                        height={449}
                        className="w-full h-auto object-contain mb-[20px] "
                        alt="NFT"
                    />
                </div>
            </div>

            {/* Stats Section */}
            {/* <div className="bg-gradient-to-r from-[#064E33] to-[#214177] w-full mt-[20px] sm:mt-[33px] py-[30px] sm:py-[24px] px-[10px] sm:px-[20px] border-[1px] border-[#0079F2] rounded-[10px]  flex flex-col items-center shadow-md glow-effect">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full fade-in">
                    {inviteDatas.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center text-center gap-5 transition hover:scale-105"
                            onClick={item.onClick} // Trigger onClick if provided
                        >
                            <div className="text-white text-[16px] sm:leading-[20px] lg:leading-[30px] h-[12px] sm:h-[16px] lg:h-[20px]">
                                <span className="hidden lg:block">{item.title.full}</span>
                                <span className="lg:hidden">{item.title.short}</span>
                            </div>
                            <div className="text-white font-bold text-[20px] sm:leading-[12px] lg:leading-[16px]  px-[10px] lg:px-[25px] sm:py-[12px] lg:py-[17px] rounded-[10px] mt-2 w-full sm:w-auto cursor-pointer">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Popup */}
            {
                showPopup && (
                    <div
                        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#196144] bg-opacity-50 z-50"
                        onClick={closePopup} // This will trigger the `closePopup` function when clicking outside the popup
                    >
                        <div
                            className="bg-[#01180E] p-6 rounded-lg shadow-lg w-[90%] sm:w-[50%] border-x-[3px] border-[#05F292]"
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the popup
                        >
                            <h2 className="text-xl font-bold mb-4 text-white text-[24px]">Invitation Details</h2>
                            <ul>
                                <li className="mb-3 border-b pb-3 last:border-none last:mb-0">
                                    <div className="flex justify-between w-full">
                                        <div className="w-[40%] text-center text-[20px] font-bold text-white">Invitee</div>
                                        <div className="w-[40%] text-center text-[20px] font-bold text-white">Time</div>
                                        <div className="w-[20%] text-center text-[20px] font-bold text-white">Rewards</div>
                                    </div>
                                </li>
                                {popupData.map((data, i) => (
                                    <li
                                        key={i}
                                        className="mb-3 border-b pb-3 last:border-none last:mb-0"
                                    >
                                        <div className="flex justify-between w-full">
                                            <div className="w-[40%] text-center text-white">{data.invitee}</div>
                                            <div className="w-[40%] text-center text-white">{data.time}</div>
                                            <div className="w-[20%] text-center text-white">{data.points}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                )
            }
            <div className="rounded-full px-[20px] py-[10px]"></div>
        </div >
    );
}