import { Router } from "express";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.patch("/:projectId", updateProject);
router.delete("/:id", deleteProject);
router.post("/", createProject);

export default router;