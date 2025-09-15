import { Request, Response } from "express";
import { ProjectService } from "./projects.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  getAllProjects = asyncHandler(async (req: Request, res: Response) => {
    const projects = await this.projectService.getAllProjects();
    ApiResponse.success(res, projects);
  });
}
