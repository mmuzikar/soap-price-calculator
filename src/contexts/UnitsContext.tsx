import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { getCountryUnit } from "../lib/geolocator";

const ALL_UNITS = ['pounds', 'ounces', 'grams'] as const
type UnitTuple = typeof ALL_UNITS
export type Units = UnitTuple[number]

interface UnitsContextData {
    units: Units
    setUnits : (u : Units) => void
    convert : (grams: number) => number
    getAllUnits : () => UnitTuple
    unitsDisplay: string
}

const context = createContext<UnitsContextData>({} as UnitsContextData)

export function useUnits() {
    return useContext(context)
}

export function UnitsContextProvider({children}: {children: ReactNode}) {
    const [units, setUnits] = useState<Units>(getCountryUnit())
    const unitsDisplay = useMemo(() => {
        switch(units){
            case "pounds": return 'lbs'
            case "ounces": return 'oz'
            case "grams": return 'g'
        }
    }, [units])

    function convert(grams: number) : number {
        switch(units) {
            case 'grams':
                return grams
            case "pounds":
                return grams * 0.002205
            case "ounces":
                return grams / 28.34952
        }
    }

    return <context.Provider value={({
        units,
        setUnits,
        convert,
        getAllUnits() {
            return ALL_UNITS
        },
        unitsDisplay
    })}>
        {children}
    </context.Provider>
}

