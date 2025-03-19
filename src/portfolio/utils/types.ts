export interface Project {
  title: string;
  imagePath: string;
  overview: string;
  features: string[];
  challenges: Challenges[];
  technologies: string[];
  githubRepo: string;
  liveDemo?: string | null;
  imageGrid?: string[];
}

export interface Challenges {
    challenge: string,
    solution: string
}

export interface MySkills {
    type: string;
    skills: string[];
}