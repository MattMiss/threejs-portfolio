import React from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";
import { motion } from "framer-motion";
import { projectCardVariants } from "../utils/animations";

const ProjectsSection: React.FC = () => (
    <div className="container px-4 py-4">
        <h1 className="text-5xl text-blue-400 mb-4 text-center">Projects</h1>
        <div className="container mx-auto py-8">
            {/* Project Cards */}
            <div className="flex flex-col gap-16">
                {projects.map((project) => (
                    <motion.div
                        key={project.title}
                        variants={projectCardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                    >
                        <ProjectCard key={project.title} project={project} />
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

export default ProjectsSection;