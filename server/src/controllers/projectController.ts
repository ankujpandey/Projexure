import {Request, Response} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    } catch (error: any) {
        console.log("error in getProjects----------", error)
        res.status(500).json({message: `Error retriving projects: ${error.message}`})
    }
}

export const createProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {name, description, startDate, endDate} = req.body;
    try {
        const newProject = await prisma.project.create({
            data:{
                name,
                description,
                startDate,
                endDate,
            },
        });
        res.status(200).json(newProject);
    } catch (error: any) {
        console.log("error in createProject----------", error)
        res.status(500).json({message: `Error creating project: ${error.message}`})
    }
}