import { PDFDocumentProxy } from 'pdfjs-dist'
import { ReactNode, useEffect, useState } from 'react'
import { parseRecipe } from './lib/recipeParser'
import { RecipeInput } from './components/Input'
import { Header } from './components/Header'
import { CurrencyContextProvider } from './contexts/CurrencyContext'
import { UnitsContextProvider } from './contexts/UnitsContext'
import { BodySection } from './components/page/BodySection'
import { RecipeContextProvider, useRecipe } from './contexts/RecipeContext'
import { Card, Spinner } from '@rewind-ui/core'

function Providers() {
  return <RecipeContextProvider>
    <CurrencyContextProvider>
      <UnitsContextProvider>
        <App />
      </UnitsContextProvider>
    </CurrencyContextProvider>
  </RecipeContextProvider>
}

function App() {
  const [recipeDoc, setRecipeDoc] = useState<Document | PDFDocumentProxy | undefined>()

  const { setRecipe, recipe } = useRecipe()

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

  let body: ReactNode = <BodySection />

  if (recipeDoc && !recipe) {
    body = <Card>
      <Spinner />
    </Card>
  }

  return (
    <div className='space-y-5'>
      <Header />
      <div className='flex items-center flex-col'>
        <RecipeInput setDocument={setRecipeDoc} />
        <div className='lg:w-4/6 md:w-full flex justify-center overflow-y-scroll'>
          {body}
        </div>
      </div>
    </div>)
}

export default Providers
