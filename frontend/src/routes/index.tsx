import { createFileRoute } from '@tanstack/react-router'
import  Landing from '../pages/Landing'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
     <Landing/>
    </div>
  )
}