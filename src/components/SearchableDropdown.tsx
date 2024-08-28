import { Input, Select } from "@rewind-ui/core"
import { ReactNode, useState, useMemo } from "react"

type SearchableDropdownProps<T> = {
    items: T[],
    defaultValue?: T,
    filterFunc: (it: T, search: string) => boolean
    displayFunc: (it: T) => ReactNode,
    valueFunc: (it: T) => string
    onChange: (it: string) => void
}

export function SearchableDropdown<T>({ items, defaultValue, filterFunc, displayFunc, valueFunc, onChange }: SearchableDropdownProps<T>) {
    const [search, setSearch] = useState('')
    const filteredItems = useMemo(() => items.filter((it) => filterFunc(it, search)), [search])

    return <>
        <Input type="search" onChange={e => setSearch(e.target.value)} />
        <Select onChange={e => onChange(e.target.value)} defaultValue={defaultValue && valueFunc(defaultValue)}>
            {filteredItems.map(item => <option key={valueFunc(item)} value={valueFunc(item)}>{displayFunc(item)}</option>)}
        </Select>
    </>
}
