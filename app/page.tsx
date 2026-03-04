import { AppSidebar } from "@/components/app-sidebar"
import { ChatArea } from "@/components/chat-area"

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <ChatArea />
    </div>
  )
}
