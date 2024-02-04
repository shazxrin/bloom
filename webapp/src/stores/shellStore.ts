import {create} from "zustand"
import {devtools} from "zustand/middleware"

interface ShellStore {
    refreshCallback: () => void
    setRefreshCallback: (refreshCallback: () => void) => void
    refresh: () => void
}

const useShellStore = create<ShellStore>()(
    devtools(
        (set, get) => ({
            refreshCallback: () => {},
            setRefreshCallback: (refreshCallback) => {
                set((state) => ({...state, refreshCallback: refreshCallback}))
            },
            refresh: () => {
                get().refreshCallback()
            }
        })
    )
)

export default useShellStore
