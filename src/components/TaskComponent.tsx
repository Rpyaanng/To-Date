import { Task } from "../store/store"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskStore, DateStore } from "@/store/store"
import { Link } from '@tanstack/react-router'

interface Props {
  task: Task,
};


export function TaskComponent(props: Props) {
  const currentDate = DateStore((state) => state.currentDate);
  const toggleTodo = TaskStore((state) => state.toggleTodo);
  const getSubCompleted = TaskStore((state) => state.getSubCompleted);

  return (
    <div className="rounded-md border flex p-2 gap-1">
      <Checkbox className="mr-2 mt-1" onCheckedChange={() => { toggleTodo(currentDate, props.task) }} checked={props.task.completed} />
      <div className="items-center w-full">
        <Link to={"/home/edit/" + props.task.id}>
          <h2 className="font-bold">
            <p>
              <span className={props.task.completed ? "task-strike task-disable" : ""}>
                {props.task.title}
              </span>
            </p>
          </h2>
          {props.task.subtasks.length > 0 &&
            <div>
              <p className="text-slate-400">
                {getSubCompleted(currentDate, props.task)}/{props.task.subtasks.length}  {props.task.subtasks.length > 1 ? "subtasks" : "subtask"} completed
              </p>
            </div>
          }
        </Link>
      </div>
    </div>
  )
}
