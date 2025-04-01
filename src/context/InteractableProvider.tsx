import { useState, useMemo } from 'react';
import { Mesh } from 'three';
import { InteractableContext } from './InteractableContext';

export const InteractableProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentInteractable, setCurrentInteractable] = useState<Mesh | null>(null);
    const [highlightedMesh, setHighlightedMesh] = useState<Mesh | null>(null);
  
    const value = useMemo(() => ({ 
        currentInteractable, 
        setCurrentInteractable, 
        highlightedMesh, 
        setHighlightedMesh 
    }), [currentInteractable, highlightedMesh]);
  
    return <InteractableContext.Provider value={value}>{children}</InteractableContext.Provider>;
};