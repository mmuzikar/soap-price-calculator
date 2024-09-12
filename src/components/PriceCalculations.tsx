import { Badge, Input } from "@rewind-ui/core"
import { useCurrencyContext } from "../contexts/CurrencyContext"
import { useRecipe } from "../contexts/RecipeContext"
import { useUnits } from "../contexts/UnitsContext"
import { useState } from "react"

export function PriceCalculations() {
    const { ingredients } = useRecipe()
    const { unitsDisplay } = useUnits()
    const { getCurrency } = useCurrencyContext()

    const [soaps, setSoaps] = useState<number>(1)


    return <div className="flex m-4">
        <p className="text-xl font-bold">
            Total price: <Badge className="text-xl" color="blue">{ingredients.calculatePrice()?.toFixed(3)} {getCurrency().symbol}</Badge>
        </p>
        <p className="text-xl font-bold">
            Price per bar: <Badge className="text-xl" color="blue">{((ingredients.calculatePrice() || 0) / soaps).toFixed(3)} {getCurrency().symbol}</Badge>
        </p>
        <div>
            <label># of bars: </label><Input type="number" value={soaps} onChange={e => setSoaps(e.target.valueAsNumber)} />
        </div>
    </div>


}