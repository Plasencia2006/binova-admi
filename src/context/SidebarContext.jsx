import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false)

    const toggle = () => setCollapsed((prev) => !prev)

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar debe usarse dentro de SidebarProvider')
    }
    return context
}