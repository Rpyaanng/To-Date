
import { Task } from "../store/store"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskStore, DateStore } from "@/store/store"
import { Link } from '@tanstack/react-router'


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
  const currentDate = DateStore((state) => state.currentDate);
  const toggleTodo = TaskStore((state) => state.toggleTodo);
  const getSubCompleted = TaskStore((state) => state.getSubCompleted);

  return (
    <div className="flex">
      <div className="w-full flex flex-col">
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div className="items-center w-full">
      </div>
    </div>
  )
}
