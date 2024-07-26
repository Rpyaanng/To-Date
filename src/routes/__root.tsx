import { createRootRoute, Link, Outlet, Navigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ListTodo } from 'lucide-react'
import { DateStore } from '@/store/store'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: Root,
});

function Root() {

  const currentDate = DateStore((state) => state.currentDate)
  const setCurrentDate = DateStore((state) => state.setCurrentDate)


  return (
    <>
      <Navigate to='/home' />
      <div className='h-screen'>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={17}
            collapsible={true}
            className='align-center'
          >
            <div className='flex flex-col grow'>
              <div className=" py-2 px-2 border-y">
                <h1 className="text-xl font-bold">To-Date</h1>
              </div>
              <div className='flex flex-col grow p-2'>
                <div className="grid flex-col grow gap-2">
                  <Link
                    to="/home"
                    className={buttonVariants({ variant: "menu", size: "default" })}
                    activeProps={{
                      className:
                        cn(buttonVariants({ variant: "menu", size: "default" }),
                        )
                    }}>
                    <ListTodo className='mr-2' />
                    To-Do
                  </Link>
                  <Calendar
                    mode="single"
                    selected={new Date(currentDate)}
                    onSelect={setCurrentDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel><Outlet /></ResizablePanel>
        </ResizablePanelGroup>
        <TanStackRouterDevtools />
      </div >
    </>
  )
}
