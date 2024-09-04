
import { getCountryForTimezone } from 'countries-and-timezones';
import countryData from '../data/countryList.json'

export function getCountry() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!userTimezone) return;
    const country = getCountryForTimezone(userTimezone)
    return country && countryData[country.id]
}

export function getCountryCurrency() : string | undefined {
    const country = getCountry()
    return country && Object.keys(country.currencies)[0]
}

export function getCountryUnit() {
    const country = getCountry()
    if (country && country.name === 'United States') {
        return 'ounces'
    }
    return 'grams'
}