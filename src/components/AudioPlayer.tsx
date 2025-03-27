// AudioPlayer.tsx
import { useEffect, useRef } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface AudioPlayerProps {
    songUrl: string;
    loop: boolean;
    initialVolume: number;
    volume: number;
    playing: boolean;
    fadeDuration: number;
}

export function AudioPlayer({ songUrl, volume, loop = true, initialVolume = 0.5, playing = false, fadeDuration = 500, }: AudioPlayerProps) {
    const { camera } = useThree();
    const sound = useRef<THREE.Audio>(null);
    const listener = useRef(new THREE.AudioListener());
    const buffer = useLoader(THREE.AudioLoader, songUrl);

    const fadeVolume = (
        from: number,
        to: number,
        duration: number
      ) => {
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
        sound.current = new THREE.Audio(listener.current);
        sound.current.setBuffer(buffer);
        sound.current.setLoop(loop);
        sound.current.setVolume(initialVolume);
        
        return () => {
            camera.remove(listener.current)
            sound.current?.stop()
        }
    }, [buffer, camera, songUrl, loop, initialVolume])

    useEffect(() => {
        if (!sound.current) return
            sound.current.setVolume(volume)
    }, [volume])
    
    useEffect(() => {
    const audio = sound.current
    if (!audio) return

    const context = listener.current.context
    if (context.state === 'suspended') {
        context.resume()
    }

    if (playing) {
        if (!audio.isPlaying) {
        audio.setVolume(0)
        audio.play()
        fadeVolume(0, volume, fadeDuration)
        }
    } else {
        if (audio.isPlaying) {
        fadeVolume(audio.getVolume(), 0, fadeDuration)
        }
    }
    }, [playing])

    useEffect(() => {
        sound.current?.setVolume(volume);
    }, [volume])

    return null
}
