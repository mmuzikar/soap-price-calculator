
export interface Currency {
    name: string,
    symbol: string    
}

type Currencies = Record<string, Currency>

export interface Country {
    name: string,
    currencies: Currencies,
    flag: string
} 