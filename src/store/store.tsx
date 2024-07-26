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
  id: String,
  completed: boolean,
  title: String,
  startTime: Date | null,
  endTime: Date | null,
  subtasks: SubTask[]
}

interface PanelStore {
  thirdOpen: boolean
  setThirdOpen: (arg0: boolean) => void
}


interface TaskStore {
  tasks: Map<Date, Task[]>,
  getCompleted: (date: Date) => number,
  getSubCompleted: (date: Date, task: Task) => number,
  addTask: (date: Date, task: Task) => void,
  addSubTask: (date: Date, task: Task, sub: SubTask) => void,
  toggleTodo: (date: Date, task: Task) => void,
  toggleSubTodo: (date: Date, task: Task, subtask: SubTask) => void,
  setTaskTitle: (date: Date, task: Task, title: string) => void,
}

interface DateStore {
  currentDate: Date,
  setCurrentDate: (date: Date | undefined) => void
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
    currentDate: getStartofDate(new Date()),
    setCurrentDate: (date: Date | undefined) => set(() => ({ currentDate: date }))
  })
)

const TaskStorage: PersistStorage<TaskStore> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const { state } = JSON.parse(str);
    const deserializedTasks = state.tasks.map((keyVal) => {

    })
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
        tasks: new Map<Date, Task[]>,
        addTask: (date: Date, task: Task) => {
          set((prev) => {
            const newMap = new Map(prev.tasks);
            const tasks = newMap.get(date);
            if (tasks) return { tasks: newMap.set(date, [...tasks, task]) }
            else return { tasks: newMap.set(date, [task]) }
          })
        },
        getCompleted: (date: Date) => {
          let count = 0;
          set((state) => {
            if (state.tasks.get(date)?.length > 0) {
              state.tasks.get(date).forEach(task => {
                if (task.completed) {
                  count++;
                }
              });
            }
          })
          return count;
        },
        getSubCompleted: (date: Date, task: Task) => {
          let count = 0;
          set((state) => {
            const dateTasks = state.tasks.get(date)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            if (tIndex != -1) {
              state.tasks.get(date)?.at(tIndex)?.subtasks.forEach(subtask => {
                if (subtask.completed) {
                  count++;
                }
              })
            }
          })
          return count;
        },
        removeTask: (date: Date, task: Task) => {
          set((prev) => {
            const newMap = new Map(prev.tasks);
            const tasks = newMap.get(date);
            if (tasks) return { tasks: newMap.set(date, tasks.filter((t) => t.id !== task.id)) }
            else return newMap
          })
        },
        addSubTask: (date: Date, task: Task, subtask: SubTask) => set((state) => { state.tasks.get(date)?.filter((t) => t.id == task.id)[0].subtasks.push(subtask) }),
        setTaskTitle: (date: Date, task: Task, title: string) => set((state) => {
          const tIndex = state.tasks.get(date)?.findIndex((t) => t.id == task.id)
          state.tasks.get(date).at(tIndex).title = title
        }),
        toggleTodo: (date: Date, task: Task) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(date)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            console.log(tIndex, task.id)
            const newMap = new Map(prev.tasks);
            if (tIndex != -1) {
              newMap.get(date).at(tIndex).completed = !newMap.get(date).at(tIndex).completed
            }
          }),
        toggleSubTodo: (date: Date, task: Task, subtask: Subtask) =>
          set((prev) => {
            const dateTasks = prev.tasks.get(date)
            const tIndex = dateTasks?.findIndex((t) => t.id == task.id)
            const newMap = new Map(prev.tasks);
            if (tIndex != -1) {
              const sIndex = dateTasks?.at(tIndex)?.subtasks.findIndex((s) => s.id == subtask.id)
              if (sIndex != -1) {
                newMap.get(date).at(tIndex).subtasks.at(sIndex).completed = !newMap.get(date).at(tIndex).subtasks.at(sIndex).completed
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
