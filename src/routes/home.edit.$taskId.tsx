import { createFileRoute, useParams, redirect } from '@tanstack/react-router'
import { Link, Navigate } from '@tanstack/react-router'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { IconInput } from '@/components/ui/iconinput'
import { DateStore, TaskStore, Subtask, Task } from '@/store/store'
import { ResizablePanel } from '@/components/ui/resizable'
import { Archive, Trash2, X } from 'lucide-react'
import { PlusIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useState, useEffect, useRef } from 'react'
import { generateUniqueID } from '@/lib/utils'

export const Route = createFileRoute('/home/edit/$taskId')({
  errorComponent: ({ }) => { return (<Navigate to='/home' />) },
  component: HomeEdit
})

function HomeEdit() {
  const toggleTodo = TaskStore((state) => state.toggleTodo)
  const toggleSubTodo = TaskStore((state) => state.toggleSubTodo)
  const setTaskTitle = TaskStore((state) => state.setTaskTitle)
  const addSubtask = TaskStore((state) => state.addSubTask)
  const getSubCompleted = TaskStore((state) => state.getSubCompleted)
  const setTaskStartTime = TaskStore((state) => state.setTaskStartTime)
  const setTaskEndTime = TaskStore((state) => state.setTaskEndTime)
  const [subIdx, setSubIdx] = useState(-1)
  const { taskId } = useParams({ strict: false })
  const currentDate = DateStore((state) => state.currentDate);
  const tasks = TaskStore((state) => state.tasks);
  const task = tasks.get(currentDate)?.find((t) => t.id == taskId)

  if (task == undefined) {
    return <h1>Hello Task is undefined</h1>
  }

  useEffect(() => {
    const subRef = document.getElementById('sub_' + subIdx)
    subRef?.focus()
  }, [subIdx])

  const onTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTaskTitle(currentDate, task, e.target.elements.title.value)
  }

  const onSubtaskAdd = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newSubtask: Subtask = {
      id: generateUniqueID(),
      title: e.target.elements.newSubtaskTitle.value,
      completed: false,
    }
    addSubtask(currentDate, task, newSubtask)
    e.target.elements.newSubtaskTitle.value = "";
  }

  const onStartTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.value)
    setTaskStartTime(currentDate, task, e.target.value);
  }

  const onEndTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.value)
    setTaskEndTime(currentDate, task, e.target.value);
  }

  return <ResizablePanel order={3} id='Panel-3' defaultSize={30}>
    <div className='flex flex-col grow'>
      <div className=" py-2 px-2 border-y flex gap-2 justify-between">
        <div className='flex gap-2'>
          <Archive />
          <Trash2 />
        </div>
        <div className='flex gap-2'>
          <Link to="/home" className='w-full'><X /></Link>
        </div>
      </div>
      <div className="flex flex-col px-2 py-2 gap-2">
        <div>
          <Checkbox onCheckedChange={() => toggleTodo(currentDate, task)} checked={task?.completed} />
          <h2 className="font-bold">Task Name</h2>
          <form onSubmit={onTitleChange}>
            <Input id="title" defaultValue={task.title} type='text' />
          </form>
        </div>
        {
          <div className="gap-2">
            <h2 className='font-bold'>Start Time</h2>
            <form onChange={onStartTimeChange}>
              <Input id="startTime" type="time" placeholder='Enter a time' className='w-full' value={new Date(task.startTime).getHours().toString().padStart(2, '0') + ":" + new Date(task.startTime).getMinutes().toString().padStart(2, '0')} />
            </form>
          </div>
        }
        {
          <div className="gap-2">
            <h2 className='font-bold'>End Time</h2>
            <form onChange={onEndTimeChange}>
              <Input id="startTime" type="time" placeholder='End of Day' className='w-full' value={new Date(task.endTime).getHours().toString().padStart(2, '0') + ":" + new Date(task.endTime).getMinutes().toString().padStart(2, '0')} />
            </form>
          </div>
        }
        <div>
          <h2 className="font-bold">Subtasks</h2>
          {
            task.subtasks.length > 0 ?
              <div className="pt-2">
                <Progress value={(getSubCompleted(currentDate, task) / task?.subtasks.length) * 100.0} />
                <p className=' text-slate-400 text-center mb-2'>{`${getSubCompleted(currentDate, task)} / ${task?.subtasks.length} Subtasks Complete`}</p>
              </div> : undefined
          }
          <div className="mb-2">
            {
              task?.subtasks.map((subtask, i) => {
                return <div key={"s_" + subtask.id + "_" + i} className="border-b mb-2 pb-2 flex items-center w-full">
                  <Checkbox className="mr-2" onCheckedChange={() => toggleSubTodo(currentDate, task, subtask)} checked={subtask.completed} />
                  {
                    subIdx == i ?
                      <input id={"sub_" + i} className="font-bold w-full" onBlur={() => setSubIdx(-1)} defaultValue={subtask.title} />
                      :
                      <div className='w-full' onClick={() => setSubIdx(i)}>
                        <span className={subtask.completed ? "task-strike task-disable" : "w-full"} >
                          {subtask.title}
                        </span>
                      </div>
                  }
                </div>
              })
            }
          </div>
          <form onSubmit={onSubtaskAdd}>
            <IconInput Icon={PlusIcon} id="newSubtaskTitle" placeholder='Type here to add a subtask' />
          </form>
        </div>
      </div>
    </div>
  </ResizablePanel >

}

