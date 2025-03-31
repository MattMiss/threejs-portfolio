import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { Vector3 } from 'three'
import { useCameraView } from '../context/CameraContext'
import gsap from 'gsap'

const CameraUpdater = () => {
  const { camera } = useThree()
  const { cameraView } = useCameraView()
  const lookAtRef = useRef(new Vector3().copy(cameraView.lookAt))

  useEffect(() => {
    gsap.to(camera.position, {
      x: cameraView.position.x,
      y: cameraView.position.y,
      z: cameraView.position.z,
      duration: 1.5,
      ease: 'power2.out',
    })

    gsap.to(lookAtRef.current, {
      x: cameraView.lookAt.x,
      y: cameraView.lookAt.y,
      z: cameraView.lookAt.z,
      duration: 1.5,
      ease: 'power2.out',
    })
  }, [cameraView])

  useFrame(() => {
    camera.lookAt(lookAtRef.current)
  })

  return null
}

export default CameraUpdater
