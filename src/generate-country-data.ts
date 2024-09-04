
import { writeFileSync } from 'fs'
import countryData from '../country_data/countries.json'

type CountryInfo = {
    name: string,
    currencies: {[string]: {name: string, symbol: string}}
}

const data : Record<string, CountryInfo> = {}

for (const country of countryData) {
    const name = country['cca2']
    data[name] = {
        name: country['name']['common'],
        currencies: country['currencies'],
        flag: country['flag']
    }
}

writeFileSync('./src/data/countryList.json', JSON.stringify(data))