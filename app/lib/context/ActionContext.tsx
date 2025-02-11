'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from "wagmi";
import axios from 'axios';
import { API_URL } from '@/app/components/config/config';
import { useRouter } from 'next/navigation';
import { disconnect } from 'process';
import { useAuth } from './AuthContext';
interface TaskData {
    projectId: number;
    taskId: number;
}

interface UserInfos {
    points: number;
    invideCode: string;
    PointsRank: string;
    inviteCount: string;
}

interface ActionContextType {
    dailyAction: Set<number>;
    questAction: Set<number>;
    cycleAction: TaskData[];
    userInfos: UserInfos;
    joinId: number;
    isPointUpdate: boolean;
    setPointUpdate: (value: boolean) => void;
    setDaily: (index: number) => void;
    setQuest: (index: number) => void;
    setCycle: (projectId: number, taskId: number) => void;
    joinProject: (index: number) => void;
    leaveProject: () => void;
    clear: () => void;
}

export const ActionContext = createContext<ActionContextType | null>(null);

interface ActionContextProviderProps {
    children: ReactNode;
}

export const ActionProvider = ({ children }: ActionContextProviderProps) => {
    const { uidInfo, isExist, setBindWallet } = useAuth();
    const [dailyAction, setDailyAction] = useState(new Set<number>());
    const [questAction, setQuestAction] = useState(new Set<number>());
    const [cycleAction, setCycleAction] = useState<TaskData[]>([]);
    const [userInfos, setUserInfos] = useState<UserInfos>({ points: 0, invideCode: '******', PointsRank: '-', inviteCount: '-' })
    const [isPointUpdate, setPointUpdate] = useState(false);

    const [joinId, setJoinId] = useState(-1);
    const { isDisconnected, isConnected, address } = useAccount();
    const setDaily = (index: number) => setDailyAction((prev) => new Set(prev).add(index));
    const setQuest = (index: number) => setQuestAction((prev) => new Set(prev).add(index));
    const setCycle = (projectId: number, taskId: number) => {
        if (!cycleAction.some((t) => t.projectId === projectId && t.taskId === taskId)) {
            setCycleAction((prev) => [...prev, { projectId, taskId }]);
        } else {
            setCycleAction((prev) =>
                prev.filter((t) => !(t.projectId === projectId && t.taskId === taskId))
            );
        }
    };
    const router = useRouter();


    const joinProject = (index: number) => {
        console.log("joinId: ", joinId)
        setJoinId(index)
    };
    const leaveProject = () => setJoinId(-2);

    const clear = () => {
        setDailyAction(new Set());
        setQuestAction(new Set());
        setUserInfos({
            points: 0,
            invideCode: '******',
            PointsRank: '-',
            inviteCount: '-',
        });
        setCycleAction([]);
        setJoinId(-1);
    }

    useEffect(() => {
        console.log("isDisconnected: ", isDisconnected);
        if (isDisconnected) {
            clear();
            // setInviteCode('******');
        }

    }, [isDisconnected])

    useEffect(() => {
        if (joinId >= 0) {
            router.push(`/projects/${joinId}`);
        } else if (joinId === -2) {
            router.push(`/`);
        }
    }, [joinId])

    useEffect(() => {
        if (isExist) {
            // 调用绑定钱包接口
            const HandleDailyAction = async () => {
                try {
                    console.log("clear");
                    clear();
                    // get user info
                    const userresponse = await axios.get(API_URL.AIRDROP_USER_INFO, {
                        headers: {
                            "uid": uidInfo?.uid,
                            "token": uidInfo?.token,
                        },
                    });
                    setUserInfos({
                        points: userresponse.data.data.points,
                        invideCode: userresponse.data.data.inviteCode,
                        PointsRank: userresponse.data.data.pointsRank,
                        inviteCount: userresponse.data.data.inviteCount,
                    });
                    setPointUpdate(false);

                    // get one time action
                    const oneTimeRespond = await axios.get(API_URL.AIRDROP_RECORD_LIST,
                        {
                            headers: {
                                "uid": uidInfo?.uid,
                                "token": uidInfo?.token,
                            },
                            params: {
                                "page": 1,
                                "size": 20,
                                "type": 1,
                            }
                        });

                    if (oneTimeRespond.status === 200) {
                        // eslint-disable-next-line
                        if (oneTimeRespond.data.data.length > 0) {
                            oneTimeRespond.data.data.some((element: any) => {
                                const action = element.action;
                                // console.log(action);
                                if (action >= 50 && action <= 53) {
                                    console.log("action", action - 50);
                                    setQuestAction((prev) => new Set(prev).add(action - 50));
                                } else if (action >= 1011) {
                                    const projectId = Math.floor((action - 1011) / 10);
                                    const taskId = (action - 1011) % 10;
                                    console.log("daily action", projectId, taskId);
                                    setCycle(projectId, taskId);
                                }
                            });
                        }
                    }

                    const dailyRespond = await axios.get(API_URL.AIRDROP_RECORD_LIST,
                        {
                            headers: {
                                "uid": uidInfo?.uid,
                                "token": uidInfo?.token,
                            },
                            params: {
                                "page": 1,
                                "size": 20,
                                "type": 2
                            }
                        }
                    );

                    if (dailyRespond.status === 200) {
                        // eslint-disable-next-line
                        if (dailyRespond.data.data.length > 0) {
                            dailyRespond.data.data.forEach((element: any) => {
                                if (element.action >= 1011) {
                                    const projectId = Math.floor((element.action - 1011) / 10);
                                    const taskId = (element.action - 1011) % 10;

                                    const currentDate = new Date();
                                    const elementDate = new Date(element.time)

                                    const currentYear = currentDate.getFullYear();
                                    const currentMonth = currentDate.getMonth();
                                    const currentDay = currentDate.getDate();


                                    const elementYear = elementDate.getFullYear();
                                    const elementMonth = elementDate.getMonth();
                                    const elementDay = elementDate.getDate();
                                    console.log("days", projectId, taskId, currentDay, elementDay);
                                    if (currentYear === elementYear &&
                                        currentMonth === elementMonth &&
                                        currentDay === elementDay) {
                                        setDailyAction((prev) => new Set(prev).add(element.action));
                                        setCycle(projectId, taskId);
                                    }
                                } else {
                                    const action = element.action - 70;
                                    console.log("Daily", action);
                                    const preDayTime = Date.now() - 86400000;
                                    if (element.time > preDayTime) {
                                        setDailyAction((prev) => new Set(prev).add(action));
                                    }
                                }
                            });
                        }
                    }

                } catch (error) {
                    alert(`Error get daily action: ${error}`);
                    return
                }
            };

            HandleDailyAction();
        }
    }, [isExist, isPointUpdate]);
    console.log("daily: ", dailyAction);
    console.log("quest: ", questAction);
    console.log("cycle: ", cycleAction);

    return (
        <ActionContext.Provider value={{
            dailyAction,
            questAction,
            cycleAction,
            joinId,
            userInfos,
            isPointUpdate,
            setPointUpdate,
            setDaily,
            setQuest,
            setCycle,
            joinProject,
            leaveProject,
            clear,
        }}>
            {children}
        </ActionContext.Provider>
    );
}

export const useAction = () => {
    const context = useContext(ActionContext);

    if (!context) {
        throw new Error('useWallet must be used within a WalletContextProvider');
    }

    return context;
};