export interface Oil {
    grams: number,
    name: string
}

export type Ingredient = Oil 

export interface Recipe {
    name?: string,
    waterAmount: number,
    lyeAmount: number,
    fragranceAmount: number,
    oils: Oil[]
    additionalIngredients: Ingredient[]
}