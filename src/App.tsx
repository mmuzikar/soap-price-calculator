import { PDFDocumentProxy } from 'pdfjs-dist'
import { useEffect, useState } from 'react'
import { parseRecipe } from './lib/recipeParser'
import { Recipe } from './types'
import { RecipeInput } from './components/Input'
import { Header } from './components/Header'
import { CurrencyContextProvider } from './contexts/CurrencyContext'
import { UnitsContextProvider } from './contexts/UnitsContext'
import { BodySection } from './components/page/BodySection'

function App() {
  const [recipeDoc, setRecipeDoc] = useState<Document | PDFDocumentProxy | undefined>()

  const [recipe, setRecipe] = useState<undefined | Recipe>(undefined)

  useEffect(() => {
    async function parse() {
      if (recipeDoc) {
        setRecipe(await parseRecipe(recipeDoc))
      } else {
        setRecipe(undefined)
      }
    }

    parse()
  }, [recipeDoc])

  return (
    <div>
      <CurrencyContextProvider>
        <UnitsContextProvider>
          <Header />
          <RecipeInput setDocument={setRecipeDoc} />

          {recipe && <BodySection {...recipe}/>}
        </UnitsContextProvider>
      </CurrencyContextProvider>
    </div>)
}

export default App
