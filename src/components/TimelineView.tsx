
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
      <h2 className="2xl font-bold">Timeline</h2>
      {timeSlots.map((timeslot: TimeSlot, i) => {
        return (
          <div key={"v_" + i} className="grid grid-cols-[2rem_auto]">
            <div className="grid grid-rows-[1rem_auto_1rem] justify-items-center m-[0.25rem]">
              <span className="dot"></span>
              <div className="line"></div>
              <span className="dot"></span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="w-full text-center">{DateToTimeDisplay(timeslot.startTime)}</span>
              {timeslot.tasks.map((task, y) => {
                return (
                  <TaskComponent key={"vt_" + y} task={task} />
                )
              })}
              <span className="w-full text-center">{DateToTimeDisplay(timeslot.endTime)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
