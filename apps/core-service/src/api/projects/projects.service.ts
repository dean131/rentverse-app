import { Project } from "@prisma/client";
import { ProjectRepository } from "./projects.repository.js";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getAllProjects(): Promise<Pick<Project, "id" | "projectName">[]> {
    return this.projectRepository.findAllProjects();
  }
}
