import { Router } from "express";
import { createTask, getTasks, getUserTasks, updateTaskStatus, addTaskComment, updateTask, deleteTask } from './../controllers/taskController';

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/update/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/:userId/comments", addTaskComment);
router.get("/user/:userId", getUserTasks);

export default router;