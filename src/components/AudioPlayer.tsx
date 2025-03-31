// AudioPlayer.tsx
import { useEffect, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudio } from '../context/AudioContext';

interface AudioPlayerProps {
    songUrl: string;
    loop: boolean;
    fadeDuration: number;
}

export function AudioPlayer({ songUrl, loop = true, fadeDuration = 500, }: AudioPlayerProps) {
    const { camera } = useThree();
    const { songVolume: volume, isSongPlaying: playing } = useAudio();
    const sound = useRef<THREE.Audio>(null);
    const listener = useRef(new THREE.AudioListener());
    const buffer = useLoader(THREE.AudioLoader, songUrl);

    const fadeVolume = ( from: number, to: number, duration: number) => {
        const audio = sound.current
        if (!audio) return
    
        const steps = 30
        const stepTime = duration / steps
        const stepAmount = (to - from) / steps
        let currentStep = 0
    
        const interval = setInterval(() => {
            currentStep++
            const newVolume = from + stepAmount * currentStep
            audio.setVolume(Math.min(Math.max(newVolume, 0), 1))
        
            if (currentStep >= steps) {
                clearInterval(interval)
                if (to === 0) {
                audio.pause()
                }
            }
        }, stepTime)
    }

    useEffect(() => {
        camera.add(listener.current);
        const audio = new THREE.Audio(listener.current);
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0);
        sound.current = audio;
        
        return () => {
            camera.remove(listener.current);
            audio.stop();
        }
    }, [buffer, camera, songUrl, loop]);
    
    useEffect(() => {
        const audio = sound.current;
        if (!audio) return;

        const context = listener.current.context;
        if (context.state === 'suspended') {
            context.resume();
        }

        if (playing) {
            if (!audio.isPlaying) {
                audio.setVolume(0);
                audio.play();
                fadeVolume(0, volume, fadeDuration);
            }
        } else {
            if (audio.isPlaying) {
                fadeVolume(audio.getVolume(), 0, fadeDuration);
            }
        }
    }, [playing])

    useEffect(() => {
        if (!sound.current) return;
        sound.current.setVolume(volume);
      }, [volume]);

    return null
}
