'use client';

import { paytoneOne } from '@/app/ui/fonts';
import Image from 'next/image';

export default function RatePage() {
    return (
        <div className=" rounded-[11px] px-6 sm:px-12 md:px-[80px] py-6 sm:py-8 md:py-[45px] mt-10 sm:mt-14 md:mt-[155px] fade-in">
            {/* Title */}
            <div
                className={`${paytoneOne.className} text-white text-[19px] sm:text-[22px] md:text-[25px] leading-[20px] sm:leading-[24px] md:leading-[30px] text-center`}
            >
                Conversion Rate
            </div>

            {/* Subtitle */}
            <div className="mx-[10%] w-[70%] text-center text-[14px] sm:text-[16px] md:text-[19px] leading-[24px] sm:leading-[28px] md:leading-[36px] text-white mt-4">
                Accumulate as much points to redeem $SBT upon memofoundation
            </div>

            {/* Rate Box */}
            <div className="bg-gradient-to-br from-[#064E33] to-[#214177] rounded-[13px] px-[10px] sm:px-[40px] md:px-[50px] py-[20px] sm:py-[25px] md:py-[30px] flex flex-col sm:flex-row justify-between items-center mt-5 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow">
                {/* Left Section */}
                <div className="w-full sm:w-[50%] flex justify-around items-center gap-10 fade-in">
                    <div className="text-[14px] sm:text-[16px] md:text-[19px] leading-[15px] sm:leading-[18px] md:leading-[24px] text-white">
                        1 Points
                    </div>
                    <div className="flex flex-col items-center animate-bounce">
                        <Image src="/Arrow_right.png" alt="right" width={28} height={10} />
                        <Image src="/Arrow_left.png" alt="left" width={28} height={10} />
                    </div>
                    <div className="flex items-center">
                        <Image src="/none.png" alt="none" width={18} height={18} className="sm:w-[22px] sm:h-[22px] mr-2" />
                        <div className="text-white text-[14px] sm:text-[16px] md:text-[19px] leading-[15px] sm:leading-[18px] md:leading-[24px]">
                            SBT
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="text-[14px] sm:text-[16px] md:text-[19px] leading-[24px] sm:leading-[28px] md:leading-[36px] text-center px-[10px] py-[5px] text-white rounded-full hover:scale-105 transition-transform">
                    Coming Soon...
                </div>
            </div>
        </div>
    );
}      
