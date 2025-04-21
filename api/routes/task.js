import express from "express"
import { addTask, archiveTask, completeTask, deleteTask, editTask, getAllTasks, getTask, getTaskArchive, getTaskComplete, getTaskOnGoing, getTaskOverdue, unArchiveTask } from "../controller/tasks.js"

const route = express.Router()

route.put("/task/", editTask)
route.get("/task/onGoing", getTaskOnGoing)
route.get("/tasks/", getAllTasks)
route.get("/task/:taskId", getTask)
route.get("/tasks/onGoing", getTaskOnGoing)
route.get("/tasks/overdue", getTaskOverdue)
route.get("/tasks/complete", getTaskComplete)
route.get("/tasks/archive", getTaskArchive)
route.post("/task/", addTask)
route.patch("/task/completeTask", completeTask)
route.patch("/task/archiveTask", archiveTask)
route.patch("/task/unArchiveTask", unArchiveTask)
route.delete("/task/:taskId", deleteTask)

export default route