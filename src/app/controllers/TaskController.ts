import { Response } from "express";
import CustomRequest from "../interface/CustomInterface";

import { taskRepository } from "../repositories/taskRepository";
import { notFoundError, unauthorizedError } from "../helpers/apiError";

class TaskController {
  async create(req: CustomRequest, res: Response): Promise<Response> {
    const { id, name, check } = req.body;

    const user = req.user;

    if(!user) {
      throw new notFoundError("user not found")
    }

    const { name: name_user, email } = user;

    const task = taskRepository.create({ id, name, check, user });

    await taskRepository.save(task);

    return res.json({ 
      name_user,
      email,
      name,
      check      
    })

  }

  async update(req: CustomRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const { check } = req.body;

    const user = req.user;

    if(!user) {
      throw new notFoundError("user not found");
    }

    const task = await taskRepository.findOne({ where: { id: Number(id), user: {id: user.id} }, relations: ["user"] });

    if(!task) {
      throw new unauthorizedError("task is not user");
    }

    await taskRepository.update(task.id, { check: check });

    const { name: name_user, id: id_user } = user;
    const { name: name_task } = task;

    return res.json({
      user: {
        id_user,
        name_user
      },
      task: {
        id,
        name_task,
        check
      }
    });
  }

  async delete(req: CustomRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = req.user;

    if(!user) {
      throw new notFoundError("user not found");
    }

    const task = await taskRepository.findOne({ where: { id: Number(id), user: {id: user.id} }, relations: ["user"] });

    if(!task) {
      throw new unauthorizedError("task is not user");
    }

    if(task.check == false) {
      throw new unauthorizedError("task cannot be deleted");
    }

    await taskRepository.delete(task.id)

    return res.json({ message: "task deleted" });
  }

  async filter(req: CustomRequest, res: Response): Promise<Response> {
    const user = req.user;

    if(!user) {
      throw new notFoundError("user not found");
    }

    const tasks = await taskRepository.find({ where: { user: { id: user.id } } });

    if(!tasks) {
      throw new notFoundError("user has no task")
    }

    return res.json({ tasks })
  }
}

export default new TaskController();