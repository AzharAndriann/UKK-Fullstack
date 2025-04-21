"use client"

import { z } from "zod"

export const TaskSchemas = z.object( {
  createDate: z.string().optional(),
  taskName: z.string().min( 1 ).max( 13 ).min(1, { message: "Task name is required" }),
  priority: z.enum( [ "Low", "Medium", "High" ] ),
  deadline: z.string().min( 1, { message: "Deadline is required" } ),
} )

export const CompleteTaskSchema= z.object( {
  taskId: z.number().optional(),
  isComplete: z.number().optional(),
} )

export const ArchiveTaskSchema = z.object( {
  taskId: z.number().optional(),
  isArchive: z.number().optional(),
} )

export const UnArchiveTaskSchema = z.object( {
  taskId: z.number().optional(),
  isArchive: z.number().optional(),
})

export const DeleteTaskSchema = z.object( {
  taskId: z.number().optional(),
})
