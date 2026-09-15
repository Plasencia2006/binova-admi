import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import { useSidebar } from '../context/SidebarContext'

export default function AdminLayout() {
    const { collapsed } = useSidebar()

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div
                className={`
          min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
            >
                <Navbar />
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}