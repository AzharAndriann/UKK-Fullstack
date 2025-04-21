import { db } from "../config/db.js"


export const getAllTasks = (req, res) => {
    const q = "SELECT * FROM tasks"
    db.query(q,(err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data)
    })
}

export const getTask = (req, res) => {
    const taskId = req.params.taskId
    const q = "SELECT * FROM tasks WHERE taskId = ?"
    db.query(q, [taskId], (err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data[0])
    })
}

export const getTaskOnGoing = (req, res) => {
    const q = "SELECT * FROM tasks WHERE deadline >= NOW() AND isComplete = 0 AND isArchive = 0"
    db.query(q, (err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data)
    })
}

export const getTaskOverdue = (req, res) => {
    const q = "SELECT * FROM tasks WHERE deadline < NOW() AND isComplete = 0 AND isArchive = 0"
    db.query(q, (err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data)
    })
}

export const getTaskComplete = (req, res) => {
    const q = "SELECT * FROM tasks WHERE isComplete = 1 AND isArchive = 0"
    db.query(q, (err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data)
    })
}

export const getTaskArchive = (req, res) => {
    const q = "SELECT * FROM tasks WHERE isArchive = 1"
    db.query(q, (err, data) => {
        if(err) return res.status(400).json({Error: err})

            return res.status(200).json(data)
    })
}

export const addTask = (req, res) => {
    const {taskName, priority, deadline} = req.body
    const q = "INSERT INTO tasks (taskName, priority, deadline) VALUES(?, ?, ?)"
    const values = [taskName, priority, deadline]
    db.query(q, values, (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully created"
            })
    })
}

export const editTask = (req, res) => {
    const {taskId, taskName, priority, deadline} = req.body
    const q = "UPDATE tasks SET taskName = ?, priority = ?, deadline = ? WHERE taskId = ?"
    const values = [taskName, priority, deadline, taskId]
    db.query(q, values, (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully updated"
            })
    })
}

export const deleteTask = (req, res) => {
    const taskId = req.params.taskId
    const q = "DELETE FROM tasks WHERE taskId = ?"
    db.query(q, [taskId], (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully deleted"
            })
    })
}

export const completeTask = (req, res) => {
    const {taskId, isComplete} = req.body
    const q = "UPDATE tasks SET isComplete = ? WHERE taskId = ?"
    const values = [isComplete, taskId]
    db.query(q, values, (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully complete"
            })
    })
}

export const archiveTask = (req, res) => {
    const {taskId, isArchive} = req.body
    const q = "UPDATE tasks SET isArchive = ? WHERE taskId = ?"
    const values = [isArchive, taskId]
    db.query(q, values, (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully archive"
            })
    })
}

export const unArchiveTask = (req, res) => {
    const {taskId, isArchive} = req.body
    const q = "UPDATE tasks SET isArchive = ? WHERE taskId = ?"
    const values = [isArchive, taskId]
    db.query(q, values, (err, data) => {
        if (err) return res.status(400).json({Error: err})

            return res.status(200).json({
                Message: "A task has been successfully delete from archive"
            })
    })
}