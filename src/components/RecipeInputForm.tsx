import { Badge, Button, Card, Input } from "@rewind-ui/core";
import { Recipe } from "../types";
import { useUnits } from "../contexts/UnitsContext";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyContext } from "../contexts/CurrencyContext";
import { useList, useObjectState } from "@uidotdev/usehooks";
import { useLocalStorage } from "../hooks/localStorage";

function NumberPerUnitItem({ name, grams, setFinalPrice: setFinalPrice, customIngredient }: { name: string, grams: number, setFinalPrice: (value: number) => void, customIngredient?: boolean }) {
    const units = useUnits()
    const { getCurrency } = useCurrencyContext()

    const [price, setPrice] = useLocalStorage(name, 0)
    const [amount, setAmount] = useLocalStorage(name + "_amount", 1000)


    const pricePerAmount = useMemo(() => {
        return price / amount
    }, [price, amount])

    useEffect(() => {
        setFinalPrice(pricePerAmount)
    }, [pricePerAmount])

    return <Card>
        <Card.Header className="p-2 justify-start gap-3">
            <strong>{name}</strong>
            :
            <span>{units.convert(grams)} {units.unitsDisplay}</span>
            *
            <span>{pricePerAmount} {getCurrency().symbol}</span>
            <span>=</span>
            <Badge className="justify-self-end">{pricePerAmount * grams} {getCurrency().symbol}</Badge>
        </Card.Header>
        <Card.Body>
            <Input type="number" value={price} className="w-1/4" placeholder={`Input price for ${amount} ${units.unitsDisplay}`} onChange={e => setPrice(parseFloat(e.target.value))} />
            <span>/</span>
            <Input type="number" className="w-1/4" value={amount} onChange={e => setAmount(parseFloat(e.target.value))}></Input>
            <span>{units.unitsDisplay}</span>
            <span>= <Badge color="blue">{pricePerAmount} {getCurrency().symbol} / {units.unitsDisplay}</Badge></span>
        </Card.Body>
    </Card>
}

export function RecipeInputForm(recipe: Recipe) {

    const [prices, setPrices] = useObjectState({})

    function updatePrice(name: string): (value: number) => void {
        return function (value) {
            setPrices(() => ({
                [name]: value
            }))
        }
    }

    return <div>
        <div className="flex flex-col w-1/2 md:w-full">
            {recipe.oils.map(oil => <NumberPerUnitItem key={`input-oil-${oil.name}`} name={oil.name} grams={oil.grams} setFinalPrice={updatePrice(oil.name)} />)}
            <NumberPerUnitItem name="Water" grams={recipe.waterAmount} setFinalPrice={updatePrice("Water")} />
            <NumberPerUnitItem name="Lye" grams={recipe.lyeAmount} setFinalPrice={updatePrice("Lye")} />
            <NumberPerUnitItem name="Fragrance" grams={recipe.fragranceAmount} setFinalPrice={updatePrice("Fragrance")} />
        </div>
    </div>
}