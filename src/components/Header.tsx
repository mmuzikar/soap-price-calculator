import { useCurrencyContext } from "../contexts/CurrencyContext"
import { SearchableDropdown } from "./SearchableDropdown"


function CurrencyDropDown() {
    const context = useCurrencyContext()

    return <SearchableDropdown
        defaultValue={context.getCurrency()}
        items={context.getAllCurrencies()}
        displayFunc={it => `${it.symbol} ${it.name}`}
        valueFunc={it => it.code}
        filterFunc={(it, search) => it.name.toLowerCase().includes(search.toLowerCase()) || it.code.toLowerCase().includes(search.toLowerCase())}
        onChange={(value) => console.log('new currency dropped', value)}
    />
}

export function Header() {

    return <div className="flex flex-row">
        <CurrencyDropDown />
    </div>

}