import { useRecipe } from "../../contexts/RecipeContext";
import { PriceCalculations } from "../PriceCalculations";
import { RecipeDisplay } from "../RecipeDisplay";
import { RecipeInputForm } from "../RecipeInputForm";



export function BodySection() {
    const { recipe } = useRecipe()

    if (!recipe) {
        return
    }

    return <main className="flex lg:flex-row md:flex-col">
        <RecipeInputForm />
        <div>
            <RecipeDisplay />
        </div>
    </main>
}