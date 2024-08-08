import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "@/store/store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function DateToDisplay(ISOString: string) {
  const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"]
  const newDate = new Date(ISOString)
  return months[newDate.getMonth()] + " " + newDate.getDate();
}

export function DateToTimeDisplay(ISOString: string) {
  return new Date(ISOString).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
}

export function OffsetDate(date: Date, offset: number) {
  const newDateMillis: number = new Date(date).getTime();
  const offsetMillis = offset * 24 * 60 * 60 * 1000;
  return new Date(newDateMillis + offsetMillis);

}

export function generateUniqueID() {
  const id = String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');
  return id;
}

export function orderTasksByTime(unsortedTasks: Task[]) {

  let sortedTasks = {
    unsortedTasks: new Array<Task>(),
    timeSlots: new Array<TimeSlot>()
  };

  if (!unsortedTasks) return sortedTasks;

  // go through all tasks
  for (let i = 0; i < unsortedTasks.length; i++) {

    const task = unsortedTasks.at(i)

    if (!task) {
      continue
    }

    // If task has a start time and end time
    if (task.startTime && task.endTime) {
      // check to see if it fits within an existing time slot
      let intersectionList = [];
      const newTimeSlot = {
        startTime: task.startTime,
        endTime: task.endTime,
        tasks: [task]
      }
      for (let j = 0; j < sortedTasks.timeSlots.length; j++) {
        const newTimeSlotStart = new Date(newTimeSlot.startTime).getTime()
        const newTimeSlotEnd = new Date(newTimeSlot.endTime).getTime()
        const timeStart = new Date(sortedTasks.timeSlots.at(j).startTime).getTime()
        const timeEnd = new Date(sortedTasks.timeSlots.at(j).endTime).getTime()
        if (timeEnd >= newTimeSlotStart && timeStart <= newTimeSlotEnd) {
          //intersection
          intersectionList.push(j);
          if (newTimeSlotStart < timeStart) {
            newTimeSlot.startTime = task.startTime
          }
          if (newTimeSlotEnd > timeEnd) {
            newTimeSlot.endTime = task.endTime
          }
          newTimeSlot.tasks = sortedTasks.timeSlots.at(j).tasks.concat(newTimeSlot.tasks).sort((t1, t2) => { return new Date(t1.startTime).getTime() - new Date(t2.startTime).getTime() })
        }
      }
      for (let j = intersectionList.length; j > 0; j--) {
        console.log("removing task")
        sortedTasks.timeSlots = sortedTasks.timeSlots.splice(j, 1);
      }
      sortedTasks.timeSlots.push(newTimeSlot)
    } else {
      // If task has a end time the slot it in the latest time slot that is available
      sortedTasks.unsortedTasks.push(task)
    }

    // else create a time slot with that task from the start of the day to the tasks's end time

  }

  return sortedTasks
}
