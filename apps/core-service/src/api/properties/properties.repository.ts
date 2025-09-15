import { prisma } from "../../lib/prisma.js";
import { Property, Prisma } from "@prisma/client";

export class PropertyRepository {
  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({
      data,
    });
  }
}
