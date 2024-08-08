
import { useEffect } from "react";
import { Task } from "../store/store"
import { TaskStore, DateStore } from "@/store/store"
import { TaskComponent } from "./TaskComponent";
import { DateToTimeDisplay } from "@/lib/utils";

interface TimeSlot {
  startTime: string,
  endTime: string,
  tasks: Task[]
}

interface TimeLineData {
  unsortedTasks: Task[];
  timeSlots: TimeSlot[];
}

interface Props {
  unsortedTasks: Task[];
  timeSlots: TimeSlot[];
};


export function TimeLineView({ unsortedTasks, timeSlots }: TimeLineData) {
  console.log(timeSlots)
  return (
    <div className="w-full">
      <h2 className="text-l font-bold">Unsorted</h2>
      <div className="flex flex-col gap-2" >
        {unsortedTasks.map((task) => {
          return <TaskComponent task={task} />
        })}
      </div>
      <h2 className="text-l font-bold">Timeline</h2>
      <div>
        {timeSlots.map((timeslot: TimeSlot, i) => {
          return (
            <div key={"v_" + i}>
              <div className="grid grid-cols-[2rem_auto]">
                <div className="grid grid-rows-[0.75rem_auto_0.75rem] justify-items-center m-[0.25rem]">
                  <span className="dot"></span>
                  <div className="line"></div>
                  <span className="dot"></span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="w-full">{DateToTimeDisplay(timeslot.startTime)}</span>
                  {timeslot.tasks.map((task, y) => {
                    return (
                      <div>
                        <TaskComponent key={"vt_" + y} task={task} />
                      </div>
                    )
                  })}
                  <span className="w-full">{DateToTimeDisplay(timeslot.endTime)}</span>
                </div>
              </div>
              {i < timeSlots.length - 1 ? <div className="flex w-[2rem] justify-center"><div className="dotted-line"></div></div> : undefined}
            </div>
          )
        })}
      </div>
    </div>
  )
}
