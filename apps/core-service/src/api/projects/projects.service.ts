// File Path: apps/core-service/src/api/projects/projects.service.ts
import { ProjectRepository } from "./projects.repository.js";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getAllProjects() {
    return this.projectRepository.findAll();
  }
}
