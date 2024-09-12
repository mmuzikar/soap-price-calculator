import { Badge, Button, Card, Dropdown, Input, Modal, Select, useToast } from "@rewind-ui/core";
import { useUnits } from "../contexts/UnitsContext";
import React, { useEffect, useMemo, useState } from "react";
import { useCurrencyContext } from "../contexts/CurrencyContext";
import { useToggle } from "@uidotdev/usehooks";
import { Price, useRecipe } from "../contexts/RecipeContext";

function NumberPerUnitItem({ name, grams, setPrice: setTotalPrice, customIngredient, removeIngredient, saveIngredient }: { name: string, grams: number, setPrice: (value: Price) => void, customIngredient?: boolean, removeIngredient?: () => void, saveIngredient?: () => void }) {
    const units = useUnits()
    const { getCurrency } = useCurrencyContext()
    const { ingredients } = useRecipe()

    const initialPrice = ingredients.getInitialPrice(name)

    const [price, setPrice] = useState(initialPrice?.price || 0)
    const [amount, setAmount] = useState(initialPrice?.amount || 1000)


    const pricePerAmount = useMemo(() => {
        return price / amount
    }, [price, amount])

    useEffect(() => {
        setTotalPrice({
            price, amount
        })
    }, [pricePerAmount])

    let actions: React.ReactNode = undefined

    if (customIngredient) {
        actions = <>
            <Button onClick={saveIngredient}>Save</Button>
            <Button onClick={removeIngredient}>-</Button>
        </>
    }

    return <Card>
        <Card.Header actions={actions} className="p-2 justify-between">
            <strong>{name}</strong>
            :
            <span>{units.convert(grams)} {units.unitsDisplay}</span>
            *
            <span>{pricePerAmount.toFixed(3)} {getCurrency().symbol}</span>
            <span>=</span>
            <Badge className="justify-self-end">{(pricePerAmount * grams).toFixed(3)} {getCurrency().symbol}</Badge>
        </Card.Header>
        <Card.Body className="flex items-center gap-3">
            <Input type="number" value={price} className="w-1/4" placeholder={`Input price for ${amount} ${units.unitsDisplay}`} onChange={e => setPrice(e.target.valueAsNumber)} />
            <span>/</span>
            <Input type="number" className="w-1/4" value={amount} onChange={e => setAmount(parseFloat(e.target.value))}></Input>
            <span>{units.unitsDisplay}</span>
            <span>=</span><Badge color="blue" className="justify-self-end">{pricePerAmount} {getCurrency().symbol} / {units.unitsDisplay}</Badge>
        </Card.Body>
    </Card>
}

type ModalProps = {
    toggleModal: () => void
    show: boolean
}

function CustomIngredientModal({ toggleModal, show }: ModalProps) {
    const { addCustomIngredient, ingredients } = useRecipe()

    const { unitsDisplay } = useUnits()
    const { getCurrency } = useCurrencyContext()

    const [name, setName] = useState<string>()
    const [gramsAsText, setGrams] = useState<string>()

    const grams = Number(gramsAsText)

    function addIngredient() {
        if (name && grams) {
            addCustomIngredient({
                grams,
                name
            })
        }
        toggleModal()
    }

    useEffect(() => {
        console.log('changed shwo', show)
        setName('')
        setGrams('')
    }, [show])

    function SavedIngredientsDropdown() {
        const currency = getCurrency().symbol
        const options = ingredients.getSavedCustomIngredients().map(val => {
            const price = ingredients.getInitialPrice(val)!
            return <option value={val} key={val}>{val} ({price.price} {currency}/ {price.amount} {unitsDisplay})</option>
        }
        )

        if (!options) {
            return <></>
        }

        return <Select value={undefined} onChange={e => setName((e.target as HTMLSelectElement).value)}>
            <option disabled selected>-- select saved ingredient --</option>
            {options}
        </Select>
    }

    return <>
        <Modal size="sm" open={show} onClose={toggleModal}>
            <Card>
                <Card.Header>
                    <strong>Add custom ingredient</strong>
                </Card.Header>
                <Card.Body>
                    <SavedIngredientsDropdown />
                    <label>Name: </label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Pigments"></Input>
                    <label>Amount({unitsDisplay}): </label><Input value={grams} type="number" onChange={e => setGrams(e.target.value)} placeholder="10"></Input>
                </Card.Body>
                <Card.Footer className="flex justify-end space-x-2">
                    <Button variant="tertiary" onClick={toggleModal}>Cancel</Button>
                    <Button variant="primary" disabled={name === undefined || grams === undefined} onClick={addIngredient}>Add</Button>
                </Card.Footer>
            </Card>
        </Modal>
    </>
}


export function RecipeInputForm() {

    const { recipe, ingredients, removeCustomIngredient } = useRecipe()

    const [openModal, toggleModal] = useToggle(false)

    if (!recipe) {
        return <></>
    }

    function updatePrice(name: string): (value: Price) => void {
        return function (value) {
            ingredients.setPrice(name, value)
        }
    }

    return <div className="space-y-3">
        <div className="flex flex-col w-1/2 md:w-full overflow-y-scroll">
            {recipe.oils.map(oil => <NumberPerUnitItem key={`input-oil-${oil.name}`} name={oil.name} grams={oil.grams} setPrice={updatePrice(oil.name)} />)}
            <NumberPerUnitItem key="Water" name="Water" grams={recipe.waterAmount} setPrice={updatePrice("Water")} />
            <NumberPerUnitItem key="Lye" name="Lye" grams={recipe.lyeAmount} setPrice={updatePrice("Lye")} />
            <NumberPerUnitItem key="Fragrance" name="Fragrance" grams={recipe.fragranceAmount} setPrice={updatePrice("Fragrance")} />
            {recipe.additionalIngredients.map(i => <NumberPerUnitItem customIngredient removeIngredient={() => removeCustomIngredient(i.name)} saveIngredient={() => ingredients.saveCustomIngredient(i.name)} key={`input-oil-${i.name}`} name={i.name} grams={i.grams} setPrice={updatePrice(i.name)} />)}
            <Button onClick={() => toggleModal()}><strong>Add ingredient</strong></Button>
        </div>
        <CustomIngredientModal toggleModal={toggleModal} show={openModal} />
    </div>
}