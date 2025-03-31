import { createContext, useContext } from 'react';

type AudioContextType = {
    songVolume: number;
    setSongVolume: (v: number) => void;
    isSongPlaying: boolean;
    setIsSongPlaying: (v: boolean) => void;
};

export const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error("useAudio must be used within AudioProvider");
    return ctx;
};