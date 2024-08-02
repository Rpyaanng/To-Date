import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "@/store/store"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"]

export function DateToDisplay(ISOString: string) {
  const newDate = new Date(ISOString)
  return months[newDate.getMonth()] + " " + newDate.getDate();
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

  if (!unsortedTasks) return

  // go through all tasks
  for (let i = 0; i < unsortedTasks.length; i++) {

    const task = unsortedTasks.at(i)

    if (!task) {
      continue
    }
    // if task has no start or end time add to unsorted
    //if (!task.startTime && !task.endTime) {
    //  sortedTasks.unsortedTasks.push(task)
    //}


    // If task has a start time and end time
    if (task.startTime && task.endTime) {
      // check to see if it fits within an existing time slot
      let hasIntersection = false;
      for (let i = 0; i < sortedTasks.timeSlots.length; i++) {
        hasIntersection = false;
        const taskStart = new Date(task.startTime).getTime()
        const taskEnd = new Date(task.endTime).getTime()
        const timeStart = new Date(sortedTasks.timeSlots.at(i).startTime).getTime()
        const timeEnd = new Date(sortedTasks.timeSlots.at(i).endTime).getTime()
        if (timeEnd >= taskStart && timeStart <= taskEnd) {
          console.log("1")
          hasIntersection = true
          //intersection
          if (taskStart < timeStart) {
            sortedTasks.timeSlots.at(i).startTime = task.startTime
          }
          if (taskEnd > timeEnd) {
            sortedTasks.timeSlots.at(i).endTime = task.endTime
          }
          sortedTasks.timeSlots.at(i).tasks.push(task)
        }
      }
      if (!hasIntersection) {

        sortedTasks.timeSlots.push({
          startTime: task.startTime,
          endTime: task.endTime,
          tasks: [task]
        })
      }
    } else {
      // If task has a end time the slot it in the latest time slot that is available
      sortedTasks.unsortedTasks.push(task)
    }

    // else create a time slot with that task from the start of the day to the tasks's end time

  }

  return sortedTasks
}
