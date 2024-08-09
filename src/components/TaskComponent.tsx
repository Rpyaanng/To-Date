import React, { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import { Task } from "../store/store"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskStore, DateStore } from "@/store/store"
import { Link } from '@tanstack/react-router'
import { Archive, Trash2, X } from 'lucide-react'
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task,
};

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() { }
});


export function TaskComponent({ task }) {
  const currentDate = DateStore((state) => state.currentDate);
  const toggleTodo = TaskStore((state) => state.toggleTodo);
  const getSubCompleted = TaskStore((state) => state.getSubCompleted);
  const removeTask = TaskStore((state) => state.removeTask)

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  };

  function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
      <button className="DragHandle" {...attributes} {...listeners} ref={ref}>
        <svg viewBox="0 0 20 20" width="12">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </button>
    );
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style}>
        <div className="rounded-md border task flex p-2 gap-1">
          <Checkbox className="mr-2 mt-1" onCheckedChange={() => { toggleTodo(currentDate, task) }} checked={task.completed} />
          <div className="items-center w-full">
            <div className="flex w-full gap-4">
              <Link to={"/home/edit/" + task.id}>
                <h2 className="font-bold">
                  <p>
                    <span className={task.completed ? "task-strike task-disable" : ""}>
                      {task.title}
                    </span>
                  </p>
                </h2>
              </Link>
              <Trash2 className="hide text-destructive p-[0.125rem] border-1 rounded-sm hover:bg-destructive hover:text-white" onClick={() => removeTask(currentDate, task)} />
            </div>
            {task.subtasks.length > 0 &&
              <div>
                <p className="text-secondary-foreground">
                  {getSubCompleted(currentDate, task)}/{task.subtasks.length}  {task.subtasks.length > 1 ? "subtasks" : "subtask"} completed
                </p>
              </div>
            }
          </div>
          <DragHandle />
        </div>

      </li>
    </SortableItemContext.Provider>
  )
}

