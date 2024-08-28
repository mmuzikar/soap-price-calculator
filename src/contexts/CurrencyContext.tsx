import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import CurrencyList from 'currency-list'
import { Currency } from "../types";

interface CurrencyContextData {
    getAllCurrencies : () => Currency[]
    getCurrency: () => Currency
    setCurrency : (c: Currency | string) => void
}


const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)


export function useCurrencyContext() {
    return useContext(CurrencyContext)
}

export function CurrencyContextProvider({children}: {children: ReactNode}) {
    const [currency, _setCurrency] = useState<Currency>(CurrencyList.get('USD'))
    const allCurrencies = useMemo(() => Object.values(CurrencyList.getAll('en_US')), [])

    const {Provider} = CurrencyContext

    function setCurrency(c: Currency | string) {
        if (typeof c === 'string') {
            _setCurrency(CurrencyList.get(c))
        } else {
            _setCurrency(c)
        }
    }

    return <Provider value={{
        setCurrency,
        getCurrency: () => currency,
        getAllCurrencies: () => allCurrencies
    }}>
        {children}
    </Provider>
}