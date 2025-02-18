import {Request, Response} from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { ParsedQs } from "qs";

const prisma = new PrismaClient();

const getString = (
    value: string | ParsedQs | (string | ParsedQs)[] | undefined
  ): string | undefined => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === "string" ? first : undefined;
    }
    return undefined;
};

export const getTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { projectId, taskName, statuses, priorities, startDate, endDate, tags } = req.query;

    if (!projectId || typeof projectId !== "string") {
        res.status(400).json({ message: "Invalid or missing projectId" });
        return;
    }

    const taskNameString = typeof taskName === "string" ? taskName : undefined;

    const statusFilter = typeof statuses === "string" ? statuses.split(",") : undefined;
    const priorityFilter = typeof priorities === "string" ? priorities.split(",") : undefined;
    const tagFilter = typeof tags === "string" ? tags.split(",") : undefined;

    const startDateStr = getString(startDate);
    const endDateStr = getString(endDate);

    try {
        const whereClause: Prisma.TaskWhereInput = {
            projectId: Number(projectId),
            ...(taskNameString && {
                title: { contains: taskNameString, mode: "insensitive" },
            }),
            ...(statusFilter && { status: { in: statusFilter } }),
            ...(priorityFilter && { priority: { in: priorityFilter } }),
            ...(startDateStr ? { dueDate: { gte: new Date(startDateStr) } } : {}),
            ...(endDateStr ? { dueDate: { lte: new Date(endDateStr) } } : {}),
            // ...(tagFilter && { tags: { hasSome: tagFilter } }),
        };

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                author: true,
                assignee: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                attachments: true,
            },
        });

        const flattenedTasks = tasks.map(task => ({
            ...task,
            comments: task.comments.map(({ user, userId, ...commentData }) => ({
                ...commentData,
                ...user,
            })),
        }));

        console.log("tasks Comments------------",flattenedTasks[0]?.comments)
        console.log("tasks------------",flattenedTasks[0])
        res.json(flattenedTasks);
    } catch (error: any) {
        console.log("error in tasks----------", error)
        res.status(500).json({message: `Error retriving tasks: ${error.message}`})
    }
}


export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    let { 
        title, 
        description, 
        status, 
        priority, 
        tags, 
        startDate, 
        dueDate, 
        points, 
        projectId, 
        authorUserId, 
        assignedUserId, 
    } = req.body;

    try {
        startDate = startDate || null;
        dueDate = dueDate || null;
        const newTask = await prisma.task.create({
            data:{
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId, 
                assignedUserId 
            },
        });
        res.status(200).json(newTask);
    } catch (error: any) {
        console.log("error in createProject----------", error)
        res.status(500).json({message: `Error creating a task: ${error.message}`})
    }
}

export const updateTaskStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data:{
                status: status,
            },
        });
        res.status(200).json(updatedTask);
    } catch (error: any) {
        console.log("error in createProject----------", error)
        res.status(500).json({message: `Error updating task: ${error.message}`})
    }
}

export const getUserTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.params;
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    {authorUserId: Number(userId)},
                    {assignedUserId: Number(userId)},
                ]
            },
            include: {
                author: true,
                assignee: true,
            },
        });
        res.json(tasks);
    } catch (error: any) {
        console.log("error in user tasks----------", error)
        res.status(500).json({message: `Error retriving user's tasks: ${error.message}`})
    }
}

export const addTaskComment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { taskId, userId } = req.params;
    const { text } = req.body;

    try {
        const addComment = await prisma.comment.create({
            data:{
                taskId: Number(taskId),
                text,
                userId: Number(userId),
            },
            include: {
                user: true,
            },
        });

        const formattedComment = {
            id: addComment.id,
            text: addComment.text,
            taskId: addComment.taskId,
            created: addComment.created,
            userId: addComment.userId,
            cognitoId: addComment.user.cognitoId,
            username: addComment.user.username,
            profilePictureUrl: addComment.user.profilePictureUrl,
            teamId: addComment.user.teamId,
        };

        console.log("comment----------", formattedComment)
        res.status(200).json(formattedComment);
    } catch (error: any) {
        console.log("Error in adding comment----------", error)
        res.status(500).json({message: `Error updating task: ${error.message}`})
    }
}