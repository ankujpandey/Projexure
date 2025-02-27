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

export const getProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {id} = req.params;
    try {
        const project = await prisma.project.findUnique(
            {
                where: {id: Number(id)}
            }
        );
        res.json(project);
    } catch (error: any) {
        console.log("error in getProject----------", error)
        res.status(500).json({message: `Error retriving project: ${error.message}`})
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

export const updateProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { projectId } = req.params;
    const dataToUpdate: any = { ...req.body };

    Object.keys(dataToUpdate).forEach((key) => {
        if (dataToUpdate[key] === '') {
            delete dataToUpdate[key];
        }
    });
    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: Number(projectId),
            },
            data: dataToUpdate,
        });
        console.log("updatedProject----------", updatedProject)
        res.status(200).json(updatedProject);
    } catch (error: any) {
        console.log("error in updatedProject----------", error)
        res.status(500).json({message: `Error updating updatedProject: ${error.message}`})
    }
}

export const deleteProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const projectId = Number(id);
    
    try {
        const deletedProject = await prisma.project.delete({
            where: { id: projectId },
        });
        
        console.log("deletedProject---------", deletedProject)
    
        res.status(200).json(deletedProject);

    } catch (error: any) {
        console.log("error in createProject----------", error)
        res.status(500).json({message: `Error updating task: ${error.message}`})
    }
}