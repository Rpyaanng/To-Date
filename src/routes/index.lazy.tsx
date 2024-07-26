import { createLazyFileRoute } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function Index() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
        </ResizablePanel>
        <Outlet />
      </ResizablePanelGroup>
    </div >

  )
}
