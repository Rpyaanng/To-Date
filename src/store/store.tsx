import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, StorageValue, PersistStorage } from 'zustand/middleware'
import { enableMapSet } from 'immer'
enableMapSet();

interface SubTask {
  id: string,
  title: string,
  completed: boolean,
}

interface Task {
  id: string,
  completed: boolean,
  title: string,
  startTime: string | null,
  endTime: string | null,
  subtasks: SubTask[]
}

interface PanelStore {
  thirdOpen: boolean
  setThirdOpen: (arg0: boolean) => void
}


interface TaskStore {
  tasks: Map<string, Task[]>,
  getCompleted: (dateISO: string) => number,
  getSubCompleted: (dateISO: string, task: Task) => number,
  addTask: (dateISO: string, task: Task) => void,
  addSubTask: (dateISO: string, task: Task, sub: SubTask) => void,
  toggleTodo: (dateISO: string, task: Task) => void,
  toggleSubTodo: (dateISO: string, task: Task, subtask: SubTask) => void,
  setTaskTitle: (dateISO: string, task: Task, title: string) => void,
  setTaskStartTime: (dateISO: string, task: Task, time: string) => void,
  setTaskEndTime: (dateISO: string, task: Task, time: string) => void,
}

interface DateStore {
  currentDate: string,
  setCurrentDate: (date: Date) => void
}


const getStartofDate = (date: Date) => {
  date.setHours(0, 0, 0, 0)
  return date;
}

const PanelStore = create<PanelStore>()(
  (set) => ({
    thirdOpen: false,
    setThirdOpen: (arg0: boolean) => set(() => ({ thirdOpen: arg0 }))
  })
)

const DateStore = create<DateStore>()(
  (set) => ({
    currentDate: getStartofDate(new Date()).toISOString(),
    setCurrentDate: (date: Date) => set(() => ({ currentDate: date.toISOString() }))
  })
)

const TaskStorage: PersistStorage<TaskStore> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const { state } = JSON.parse(str);
    return {
      state: {
        ...state,
        tasks: new Map(state.tasks),
      },
    }
  },
  setItem: (name, newValue: StorageValue<TaskStore>) => {
    // functions cannot be JSON encoded
    const str = JSON.stringify({
      state: {
        ...newValue.state,
        tasks: Array.from(newValue.state.tasks.entries()),
      },
    })
    localStorage.setItem(name, str)
  },
  removeItem: (name) => localStorage.removeItem(name),
}


const TaskStore = create<TaskStore>()(
  immer(
    persist(
      (set) => ({
        tasks: new Map<string, Task[]>,
        addTask: (dateISO: string, task: Task) => {
          set((prev) => {
            const newMap = new Map(prev.tasks);
            const tasks = newMap.get(dateISO);
            if (tasks) return { tasks: newMap.set(dateISO, [...tasks, task]) }
            else return { tasks: newMap.set(dateISO, [task]) }
          })
        },
        getCompleted: (dateISO: string) => {
          let count = 0;
          set((state) => {
            if (state.tasks.get(dateISO)?.length > 0) {
              state.tasks.get(dateISO).forEach(task => {
                if (task.completed) {
                  count++;
                }
              });
            }
          })
          return count;
        },
        getSubCompleted: (dateISO: string, task: Task) => {
          let count = 0;
          set((state) => {
            const dateTasks = state.tasks.get(dateISO)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            if (tIndex != -1) {
              state.tasks.get(dateISO)?.at(tIndex)?.subtasks.forEach(subtask => {
                if (subtask.completed) {
                  count++;
                }
              })
            }
          })
          return count;
        },
        removeTask: (dateISO: string, task: Task) => {
          set((prev) => {
            const newMap = new Map(prev.tasks);
            const tasks = newMap.get(dateISO);
            if (tasks) return { tasks: newMap.set(dateISO, tasks.filter((t) => t.id !== task.id)) }
            else return newMap
          })
        },
        addSubTask: (dateISO: string, task: Task, subtask: SubTask) => set((state) => { state.tasks.get(dateISO)?.filter((t) => t.id == task.id)[0].subtasks.push(subtask) }),
        setTaskTitle: (dateISO: string, task: Task, title: string) => set((state) => {
          const tIndex = state.tasks.get(dateISO)?.findIndex((t) => t.id == task.id)
          state.tasks.get(dateISO).at(tIndex).title = title
        }),
        setTaskStartTime: (dateISO: string, task: Task, time: string) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(dateISO)
            if (!dateTasks) return
            const tIndex = dateTasks.findIndex((t) => t.id == task.id)
            if (tIndex == -1) return;
            const newMap = new Map(prev.tasks);
            const dayStart = new Date(dateISO);
            const hourMin = time.split(":");
            dayStart.setHours(Number(hourMin[0]))
            dayStart.setMinutes(Number(hourMin[1]))
            newMap.get(dateISO).at(tIndex).startTime = dayStart.toISOString()
          }),
        setTaskEndTime: (dateISO: string, task: Task, time: string) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(dateISO)
            if (!dateTasks) return
            const tIndex = dateTasks.findIndex((t) => t.id == task.id)
            if (tIndex == -1) return;
            const newMap = new Map(prev.tasks);
            const dayStart = new Date(dateISO);
            const hourMin = time.split(":");
            dayStart.setHours(Number(hourMin[0]))
            dayStart.setMinutes(Number(hourMin[1]))
            newMap.get(dateISO).at(tIndex).endTime = dayStart.toISOString()
          }),
        toggleTodo: (dateISO: string, task: Task) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(dateISO)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            console.log(tIndex, task.id)
            const newMap = new Map(prev.tasks);
            if (tIndex != -1) {
              newMap.get(dateISO).at(tIndex).completed = !newMap.get(dateISO).at(tIndex).completed
            }
          }),
        toggleSubTodo: (dateISO: string, task: Task, subtask: SubTask) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(dateISO)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            const newMap = new Map(prev.tasks);
            if (tIndex != -1) {
              const sIndex = dateTasks?.at(tIndex)?.subtasks.findIndex((s) => s.id == subtask.id)
              if (sIndex != -1) {
                newMap.get(dateISO).at(tIndex).subtasks.at(sIndex).completed = !newMap.get(dateISO).at(tIndex).subtasks.at(sIndex).completed
              }
            }
          }),
      }),
      {
        name: 'task-storage',
        version: 0,
        storage: TaskStorage
      }
    )))

export { TaskStore, DateStore, PanelStore, type Task }
