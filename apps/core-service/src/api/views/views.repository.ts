// File Path: apps/core-service/src/api/views/views.repository.ts
import { prisma } from "../../lib/prisma.js";

export class ViewRepository {
  async findAll() {
    return prisma.view.findMany();
  }
}
