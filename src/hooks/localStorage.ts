import { useEffect, useState } from "react";


export function useLocalStorage<T>(key: string | undefined, initialValue: T) {
    if (key && localStorage.getItem(key)) {
        initialValue = localStorage.getItem(key) as T
    }
    const [state, setState] = useState<T>(initialValue)



    useEffect(() => {
        if (key) {
            window.localStorage.setItem(key, String(state))
        }
    },[state])

    return [state, setState] as const
}