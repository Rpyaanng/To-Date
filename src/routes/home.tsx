import { createFileRoute } from '@tanstack/react-router'
import { Outlet, Navigate } from '@tanstack/react-router'
import { TaskComponent } from "@/components/TaskComponent"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { DateToDisplay, generateUniqueID } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconInput } from '@/components/ui/iconinput'
import { Progress } from '@/components/ui/progress'
import { TaskStore, DateStore, Task, SubTask } from "@/store/store"
import { ChevronRight, ChevronLeft, PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { TimeLineView } from '@/components/TimelineView'
import { orderTasksByTime } from "@/lib/utils";

export const Route = createFileRoute('/home')({
  component: Home,
})

function Home() {

  const currentDate = DateStore((state) => state.currentDate);
  const tasks = TaskStore((state) => state.tasks);
  const GetCompleted = TaskStore((state) => state.getCompleted);
  const AddTask = TaskStore((state) => state.addTask)

  const subTaskA: SubTask = {
    title: "Hello World 1",
    completed: false,
    id: "bBb"
  }
  const debugTask: Task = {
    id: "cCa",
    title: "Hello World",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    subtasks: [subTaskA],
    completed: false,
  }

  const onTaskAdd = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newTask: Task = {
      id: generateUniqueID(),
      title: e.target.elements.newTitle.value,
      startTime: null,
      endTime: null,
      completed: false,
      subtasks: []
    }
    AddTask(currentDate, newTask)
    e.target.elements.newTitle.value = "";
  }

  const debugAddTask = () => {
    AddTask(currentDate, debugTask);
  }

  const debugLogTask = () => {
    console.log(tasks);
    console.log(tasks.has(currentDate));
    console.log(currentDate);
  }

  const orderedTasks = orderTasksByTime(tasks.get(currentDate));

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel id='panel-2' className='h-[100vh]'>
          <div className='flex flex-col '>
            <div className="justify-center py-3 px-2 border-y flex justify-items-center flex-col mb-2 h-[18vh]">
              <div className='flex w-full justify-between mb-6'>
                <Button variant='outline'><ChevronLeft /></Button>
                <h1 className="font-bold text-5xl text-center">{DateToDisplay(currentDate)}</h1>
                <Button variant='outline'><ChevronRight /></Button>
              </div>
              <Progress value={(GetCompleted(currentDate) / tasks.get(currentDate)?.length) * 100.0} />
              <span className='text-slate-400 text-center'>{GetCompleted(currentDate)} / {tasks.get(currentDate)?.length} Tasks Complete</span>
            </div>
            <div className='h-[82vh] overflow-auto'>
              <div className="justify-center flex justify-items-center flex-col" >
                <div className="flex flex-col gap-2 mb-2 m-2">
                  <TimeLineView {...orderedTasks} />
                </div>
                <form className="relative sticky bottom-6 bg-white mb-4 mx-2 mt-2" onSubmit={onTaskAdd}>
                  <IconInput id="newTitle" type="text" Icon={PlusIcon} placeholder='Type here to add a task' />
                </form>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle id='handle-3' />
        <Outlet />
      </ResizablePanelGroup>
    </div >
  )
}

