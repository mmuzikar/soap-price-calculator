import { Recipe } from "../../types";
import { RecipeDisplay } from "../RecipeDisplay";
import { RecipeInputForm } from "../RecipeInputForm";



export function BodySection(recipe : Recipe) {
    return <main className="flex lg:flex-row md:flex-col">
        <RecipeInputForm {...recipe}></RecipeInputForm>
        <RecipeDisplay {...recipe}/>
    </main>
}