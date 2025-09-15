import { prisma } from "../../lib/prisma.js";
import { Project } from "@prisma/client";

export class ProjectRepository {
  async findAllProjects(): Promise<Pick<Project, "id" | "projectName">[]> {
    return prisma.project.findMany({
      select: {
        id: true,
        projectName: true,
      },
    });
  }
}
