
import { writeFileSync } from 'fs'
import countryData from '../country_data/countries.json'

type CountryInfo = {
    name: string,
    currencies: {[key: string]: {name: string, symbol: string}},
    flag: string
}

const data : Record<string, CountryInfo> = {}

for (const country of countryData) {
    const name = country['cca2']
    data[name] = {
        name: country['name']['common'],
        currencies: country['currencies'] as any,
        flag: country['flag']
    }
}

writeFileSync('./src/data/countryList.json', JSON.stringify(data))