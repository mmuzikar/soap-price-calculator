import { Button, Dropdown, Input, Select } from "@rewind-ui/core"
import { useCurrencyContext } from "../contexts/CurrencyContext"
import { Units, useUnits } from "../contexts/UnitsContext"
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

    const currentCurrency = <CurrencyDisplay {...context.getCurrency()} />

    return <div>
        <label>Currency:</label>
        <Dropdown>
            <Dropdown.Trigger>
                <Button>
                    <strong>{currentCurrency}</strong>
                </Button>
            </Dropdown.Trigger>

            <Dropdown.Content>
                <Input type="search" onChange={e => setSearch(e.target.value)}></Input>
                <Dropdown.Label color="black">Currently selected: {currentCurrency}</Dropdown.Label>
                <Dropdown.Divider />
                <div className="max-h-[80dvh] overflow-y-scroll">
                    {filteredItems.map(c => <Dropdown.Item key={c.code} onClick={() => context.setCurrency(c)}><CurrencyDisplay {...c} /></Dropdown.Item>)}
                </div>
            </Dropdown.Content>
        </Dropdown>
    </div>
}

function UnitsDropDown() {
    const units = useUnits()

    return <div>
        <label>Units of measurement:</label>
        <Select withRing onChange={e => units.setUnits(e.target.value as Units)} defaultValue={'grams'}>
            {units.getAllUnits().map(unit => <option key={unit} value={unit}>{capitalize(unit)}</option>)}
        </Select>
    </div>

}

export function Header() {

    return <div className="sticky z-40 top-0 p-4 flex flex-row justify-around gap-4 backdrop-blur-md bg-slate-500/30 shadow-lg">
        <h1 className="text-4xl font-extrabold self-center">SoapCalc price calculator</h1>
        <div className="flex-grow"></div>
        <CurrencyDropDown />
        <UnitsDropDown />
    </div>

}