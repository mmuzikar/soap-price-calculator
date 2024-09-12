import { Input, Text } from "@rewind-ui/core"
import { RecipeInputDocument } from "../types"
import { FormEvent, useEffect, useState } from "react"
import { getDocument } from "pdfjs-dist"

type Props = {
    setDocument: (doc: RecipeInputDocument) => void
}


export function RecipeInput({ setDocument }: Props) {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (!file) {
            return
        }
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl)
        }
        const url = URL.createObjectURL(file)
        setFileUrl(url)

        async function fetchFile(file: File) {
            if (file.type === 'text/html') {
                setDocument((new DOMParser).parseFromString(await file.text(), file.type))
            } else if (file.type === 'application/pdf') {
                const document = getDocument(await file.arrayBuffer())
                setDocument(await document.promise)
            }
        }

        fetchFile(file)

    }, [file])


    function onFileInput(e: FormEvent<HTMLInputElement>) {
        setFile(e.target.files[0])
    }

    function onDrop(e : React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (e.dataTransfer.items) {
            setFile([...e.dataTransfer.items][0].getAsFile() || undefined)
        }
    }

    return <div onDrop={onDrop} className="p-4 border-4 border-dashed rounded-lg w-1/2 flex justify-center flex-col">
        <h1 className="py-3 font-bold text-xl">SoapRecipe price calculator</h1>
        
        <Text className="py-2" size="lg">You can import any recipe from <a href="http://www.soapcalc.net/calc/SoapCalcWP.asp">SoapCalc</a> and the recipe will get loaded for you.</Text>
        <Text size="base">You can use either pdf or html.</Text>
        <Input type='file' accept=".pdf,.html" onInput={onFileInput}></Input>

    </div>

}