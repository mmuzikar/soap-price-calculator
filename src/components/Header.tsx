import { Button, Dropdown, Input, Select } from "@rewind-ui/core"
import { useCurrencyContext } from "../contexts/CurrencyContext"
import { Units, useUnits } from "../contexts/UnitsContext"
import { SearchableDropdown } from "./SearchableDropdown"
import { useMemo, useState } from "react"
import { Currency } from "../types"
import { capitalize } from "../utils"

function CurrencyDisplay(c: Currency) {
    return <>{c.name} ({c.symbol})</>
}

function CurrencyDropDown() {
    const context = useCurrencyContext()

    const [search, setSearch] = useState('')
    const filteredItems = useMemo(() => context.getAllCurrencies().filter(it => it.name.toLowerCase().includes(search.toLowerCase()) || it.code.toLowerCase().includes(search.toLowerCase())), [search])

    // return <SearchableDropdown
    //     defaultValue={context.getCurrency()}
    //     items={context.getAllCurrencies()}
    //     displayFunc={it => `${it.symbol} ${it.name}`}
    //     valueFunc={it => it.code}
    //     filterFunc={(it, search) => it.name.toLowerCase().includes(search.toLowerCase()) || it.code.toLowerCase().includes(search.toLowerCase())}
    //     onChange={(value) => console.log('new currency dropped', value)}
    // />

    const currentCurrency = <CurrencyDisplay {...context.getCurrency()}/>

    return <Dropdown>
        <Dropdown.Trigger>
            <Button>
                {currentCurrency}
            </Button>
        </Dropdown.Trigger>

        <Dropdown.Content>
            <Input type="search" onChange={e => setSearch(e.target.value)}></Input>
            <Dropdown.Label color="black">Currently selected: {currentCurrency}</Dropdown.Label>
            <Dropdown.Divider />
            {filteredItems.map(c => <Dropdown.Item key={c.code} onClick={() => context.setCurrency(c)}><CurrencyDisplay {...c}/></Dropdown.Item>)}
        </Dropdown.Content>
    </Dropdown>
}

function UnitsDropDown() {
    const units = useUnits()

    return <Select onChange={e => units.setUnits(e.target.value as Units)} defaultValue={'grams'}>
        {units.getAllUnits().map(unit => <option value={unit}>{capitalize(unit)}</option>)}
    </Select>

}

export function Header() {

    return <div className="flex flex-row">
        

        <CurrencyDropDown />
        <UnitsDropDown />
    </div>

}