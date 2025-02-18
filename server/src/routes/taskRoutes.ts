import { Router } from "express";
import { createTask, getTasks, getUserTasks, updateTaskStatus, addTaskComment } from './../controllers/taskController';

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.post("/:taskId/:userId/comments", addTaskComment);
router.get("/user/:userId", getUserTasks);

export default router;