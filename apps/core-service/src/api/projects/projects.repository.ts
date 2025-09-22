// File Path: apps/core-service/src/api/projects/projects.repository.ts
import { prisma } from "../../lib/prisma.js";

export class ProjectRepository {
  async findAll() {
    return prisma.project.findMany({
      orderBy: {
        projectName: "asc",
      },
    });
  }
}
