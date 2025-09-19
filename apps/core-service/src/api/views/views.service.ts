// File Path: apps/core-service/src/api/views/views.service.ts
import { ViewRepository } from "./views.repository.js";

export class ViewService {
  private viewRepository: ViewRepository;

  constructor(viewRepository: ViewRepository) {
    this.viewRepository = viewRepository;
  }

  async getAllViews() {
    return this.viewRepository.findAll();
  }
}
