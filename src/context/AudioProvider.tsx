import { useState, useMemo } from 'react';
import { AudioContext } from './AudioContext';

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [songVolume, setSongVolume] = useState(0.5);
    const [isSongPlaying, setIsSongPlaying] = useState(false);
  
    const value = useMemo(() => ({ songVolume, setSongVolume, isSongPlaying, setIsSongPlaying }), [songVolume, isSongPlaying]);
  
    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};