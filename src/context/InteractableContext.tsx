import { createContext, useContext } from 'react';
import { Mesh } from 'three';

type InteractableContextType = {
    currentInteractable: Mesh | null;
    setCurrentInteractable: (v: Mesh | null) => void;
    highlightedMesh: Mesh | null;
    setHighlightedMesh: (v: Mesh | null) => void;
};

export const InteractableContext = createContext<InteractableContextType | null>(null);

export const useInteractable = () => {
    const ctx = useContext(InteractableContext);
    if (!ctx) throw new Error("useInteractable must be used within InteractableProvider");
    return ctx;
};