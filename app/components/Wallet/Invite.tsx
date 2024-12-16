// import { useWallet } from '@/app/lib/context/WalletContext';
import { useState } from "react";
import axios from 'axios';
import { useWallet } from "../../lib/context/WalletContext";
import { useUser } from "../../lib/context/AuthContext";

export default function Invite() {
    const { isInvited, closeInvite } = useWallet();
    const { userInfo } = useUser();
    const [values, setValues] = useState(Array(6).fill("")); // Separate state for each input
    const [success, setSuccess] = useState(false); // State for success popup

    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newValues = [...values];
            newValues[index] = value; // Update only the specific index
            setValues(newValues);

            // Automatically focus the next input if a number is entered
            if (value && index < values.length - 1) {
                document.getElementById(`input-${index + 1}`)?.focus();
            }

            // // Check if the entered code matches "021025"
            // if (newValues.join("") === "021025") {
            //     setSuccess(true);
            // }
        }
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6); // Get only first 6 characters
        if (/^\d+$/.test(pasteData)) {
            const newValues = pasteData.split("").slice(0, 6); // Split pasted numbers
            setValues(newValues);

            // Automatically focus the last filled input
            const lastFilledIndex = newValues.length - 1;
            if (lastFilledIndex < values.length) {
                document.getElementById(`input-${lastFilledIndex}`)?.focus();
            }

            // Check if the pasted code matches "021025"
            try {
                const inviteCode = newValues.join("");
                const respond = await axios.post("https://airdrop.7nc.top/api/invite/bind", {
                    "inviteCode": inviteCode
                }, {
                    headers: {
                        "accept": "application/hal+json",
                        "Content-Type": "application/json",
                        "uid": userInfo.uid,
                        "token": userInfo.token
                    }
                });
                if (respond.status == 200) {
                    if (respond.data.result == 1) {
                        console.log(respond.data.data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    console.log(isInvited);

    return (
        <div className="w-[80%] lg:w-[50%] mt-[100px] px-[30px] pt-[20px] pb-[30px] mx-auto bg-gradient-to-bl from-[#061B13] to-[#064E33] rounded-lg">
            <div className="text-[24px] sm:text-[34px] font-bold bg-gradient-to-r from-[#05F292] to-[#214177] text-transparent bg-clip-text text-center mt-[50px]">
                Early Access Airdrop
            </div>
            <div className="text-white text-center mt-[10px]">
                Enter your invite code to claim your airdrop
            </div>
            <div className="flex justify-center gap-[10px] mt-[20px]" onPaste={handlePaste}>
                {values.map((value, index) => (
                    <input
                        key={index}
                        id={`input-${index}`}
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        maxLength={1} // Limit the length to 1 character
                        className="w-[50px] h-[50px] text-center text-[24px] border border-gray-300 rounded-md"
                        style={{
                            lineHeight: "50px",
                            fontSize: "24px",
                            textAlign: "center",
                        }}
                    />
                ))}
            </div>
            <div className="bg-[#05F292] flex justify-center items-center rounded-full px-4 py-2 mt-5 shadow-md transform hover:scale-110 transition-transform duration-300 w-[50%] mx-[25%]">
                <span className="font-bold text-[14px] sm:text-[16px] text-white cursor-pointer">
                    Enter invite code
                </span>
            </div>
            <div className="text-white text-center mt-[10px]">No invitation code? <span className="cursor-pointer underline" onClick={() => { closeInvite(); }}>Skip</span></div>

            {/* Success Popup */}
            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
                        <h2 className="text-2xl font-bold text-green-500">Success!</h2>
                        <p className="mt-2 text-gray-700">You have entered the correct code.</p>
                        <button
                            onClick={() => { setSuccess(false); closeInvite(); }}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}