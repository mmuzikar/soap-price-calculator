import { createContext, useContext, useMemo, useState } from "react";
import { Ingredient, Recipe } from "../types";
import { useObjectState } from "@uidotdev/usehooks";

interface RecipeContext {
    recipe?: Recipe
    ingredients : Ingredients
    setRecipe(r: Recipe | undefined) : void
    addCustomIngredient(i: Ingredient) : void
    removeCustomIngredient(name: string): void
}

export type Price = {price : number, amount: number}
type Prices = Record<string, Price>

interface Ingredients {
    pricePerGram : Prices
    getInitialPrice(name: string) : Price | undefined
    calculatePrice() : number | undefined
    setPrice(name: string, price: Price) : void
    saveCustomIngredient(name: string): void
    getSavedCustomIngredients() : string[]
}


const context = createContext({} as RecipeContext)


export function RecipeContextProvider({children} : {children: React.ReactNode}) {

    const [recipe, setRecipe] = useState<Recipe | undefined>(undefined)

    const [pricePerAmount, setPricePerAmount] = useObjectState({} as Prices)

    const pricePerGram = useMemo(() => Object.entries(pricePerAmount).map(([key, price]) => ({[key]: price.price / price.amount})).reduce((acc, curr) => ({...acc, ...curr}), {}) ,[pricePerAmount])

    function saveIngredient(name: string, perGram: Price) {
        window.localStorage.setItem(name, JSON.stringify(perGram))
    }

    const ingredients : Ingredients = {
        pricePerGram: pricePerAmount,
        getInitialPrice(name) {
            const val = window.localStorage.getItem(name)
            return val && JSON.parse(val)
        },
        setPrice(name, price) {
            setPricePerAmount({
                [name]: price
            })

            if (recipe?.oils.filter(o => o.name === name)) {
                saveIngredient(name, price)
            }
        },
        calculatePrice() {
            if (recipe) {
                console.log(pricePerGram)
                return recipe.oils.map(oil => pricePerGram[oil.name] * oil.grams).reduce((acc, val) => acc + val, 0)
                    + pricePerGram['Water'] * recipe.waterAmount
                    + pricePerGram['Lye'] * recipe.lyeAmount
                    + pricePerGram['Fragrance'] * recipe.fragranceAmount
                    + recipe.additionalIngredients.map(oil => pricePerGram[oil.name] * oil.grams).reduce((acc, val) => acc + val, 0)
            }
            return undefined
        },
        saveCustomIngredient(name) {
            
            const items : string[] = JSON.parse(window.localStorage.getItem('customItems') || '[]')

            window.localStorage.setItem('customItems', JSON.stringify([...items, name]))

            saveIngredient(name, pricePerAmount[name])
        },
        getSavedCustomIngredients() {
            return JSON.parse(window.localStorage.getItem('customItems') || '[]')
        },
    }

    return <context.Provider value={{
        recipe,
        setRecipe,
        addCustomIngredient(i) {
            setRecipe(r => {
                if (!r) {
                    return
                }
                return {
                    ...r,
                    additionalIngredients:
                    [...r.additionalIngredients, i]
                }
            })
        },
        removeCustomIngredient(name) {
            setRecipe(r => {
                if (!r) {
                    return
                }
                return {
                    ...r,
                    additionalIngredients: r.additionalIngredients.filter(i => i.name != name)
                }
            })
        },
        ingredients
    }}>
        {children}
    </context.Provider>

}


export function useRecipe() {
    return useContext(context)
}