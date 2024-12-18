'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from "wagmi";
import axios from 'axios';

interface TaskData {
    projectId: number;
    taskId: number;
}

interface ActionContextType {
    dailyAction: Set<number>;
    questAction: Set<number>;
    cycleAction: TaskData[];
    joinId: number;
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
    const [dailyAction, setDailyAction] = useState(new Set<number>());
    const [questAction, setQuestAction] = useState(new Set<number>());
    const [cycleAction, setCycleAction] = useState<TaskData[]>([]);
    const [joinId, setJoinId] = useState(-1);
    const { isConnected, address } = useAccount();
    const setDaily = (index: number) => setDailyAction((prev) => new Set(prev).add(index));
    const setQuest = (index: number) => setQuestAction((prev) => new Set(prev).add(index));
    const setCycle = (projectId: number, taskId: number) => {
        if (!cycleAction.some((t) => t.projectId === projectId && t.taskId === taskId)) {
            setCycleAction((prev) => [...prev, { projectId, taskId }]);
        }
    };

    const joinProject = (index: number) => setJoinId(index);
    const leaveProject = () => setJoinId(-1);

    const clear = () => {
        setDailyAction(new Set());
        setQuestAction(new Set());
        setCycleAction([]);
        setJoinId(-1);
    }

    useEffect(() => {
        if (isConnected && address) {
            // 调用绑定钱包接口
            const HandleDailyAction = async () => {
                try {
                    clear();
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
                        const oneTimeRespond = await axios.get("https://airdrop.7nc.top/api/record/list?page=1&size=20&type=1",
                            {
                                headers: {
                                    "uid": response.data.data.uid,
                                    "token": response.data.data.token,
                                }
                            });

                        if (oneTimeRespond.status === 200) {
                            // eslint-disable-next-line
                            oneTimeRespond.data.data.some((element: any) => {
                                const action = element.action;
                                // console.log(action);
                                if (action >= 50 && action <= 53) {
                                    console.log(action - 50);
                                    setQuestAction((prev) => new Set(prev).add(action - 50));
                                } else if (action >= 1011) {
                                    const projectId = Math.floor((action - 1011) / 10);
                                    const taskId = (action - 1011) % 10;
                                    console.log(projectId, taskId);
                                    setCycle(projectId, taskId);
                                }
                            });
                        }

                        const dailyRespond = await axios.get("https://airdrop.7nc.top/api/record/list?page=1&size=20&type=2",
                            {
                                headers: {
                                    "uid": response.data.data.uid,
                                    "token": response.data.data.token,
                                }
                            }
                        );

                        if (dailyRespond.status === 200) {
                            // eslint-disable-next-line
                            dailyRespond.data.data.forEach((element: any) => {
                                const action = element.action - 70;
                                console.log(action);
                                const preDayTime = Date.now() - 86400000;
                                if (element.time > preDayTime) {
                                    setDailyAction((prev) => new Set(prev).add(action));
                                }
                            });
                        }
                    } else {
                        console.error("Failed to bind wallet:", response.data);
                    }
                } catch (error) {
                    console.error("Error binding wallet:", error);
                }
            };

            HandleDailyAction();
        }
    }, [isConnected, address]);
    console.log("daily: ", dailyAction);
    console.log("quest: ", questAction);
    console.log("cycle: ", cycleAction);

    return (
        <ActionContext.Provider value={{
            dailyAction,
            questAction,
            cycleAction,
            joinId,
            setDaily,
            setQuest,
            setCycle,
            joinProject,
            leaveProject,
            clear
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