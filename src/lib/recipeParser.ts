import { PDFDocumentProxy } from "pdfjs-dist";
import { Oil, Recipe } from "../types";
import { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

interface RecipeParser<T> {
    parse(document: T): Promise<Recipe>
}

class HTMLParser implements RecipeParser<Document> {
    private static NAME_COLUMN = 2
    private static GRAMS_COLUMN = 6

    private mapRowToOil(row: Element): Oil {
        const columns = [...row.querySelectorAll('td').values()!]

        const name = columns[HTMLParser.NAME_COLUMN].textContent!
        const grams = Number(columns[HTMLParser.GRAMS_COLUMN].textContent!)

        return {
            name, grams
        }
    }

    private findRowByText(table: Element, text: string): Element | undefined {
        return [...table.querySelectorAll('tr').values()].filter(row => row.textContent?.includes(text)).pop()
    }

    private getGramsFromLyeTable(row: Element): number {
        return Number(row.querySelector('td:nth-child(4)')?.textContent)
    }

    async parse(document: Document): Promise<Recipe> {
        const name = document.querySelector('#inputRecipeName')?.nodeValue || undefined
        const oilsTable = document.querySelector('#tblOilDetail')
        const oilsRows = [...oilsTable?.querySelectorAll('tr').values()!]
        //remove header and totals
        oilsRows.shift()
        oilsRows.pop()
        const oils = oilsRows.map(this.mapRowToOil)

        const tableLyeWater = document.querySelector('#tblLyeWater')!
        const waterAmount = this.getGramsFromLyeTable(this.findRowByText(tableLyeWater, 'Water')!)
        const lyeAmount = this.getGramsFromLyeTable(this.findRowByText(tableLyeWater, 'Lye')!)
        const fragranceAmount = this.getGramsFromLyeTable(this.findRowByText(tableLyeWater, 'Fragrance')!)

        return {
            name,
            oils,
            waterAmount,
            lyeAmount,
            fragranceAmount,
            additionalIngredients: []
        }
    }

}

type Location = { x: number, y: number }

class PDFParser implements RecipeParser<PDFDocumentProxy> {

    getLocation(text: TextItem | TextMarkedContent | number): Location {
        const transform = (text as TextItem)?.transform
        return { x: transform[4], y: transform[5] }
    }

    findText(texts: TextContent, text: string): number {
        return texts.items.findIndex(item => (item as TextItem).str.search(text) >= 0)
    }

    private mergeRow(texts: TextItem[]) : string[] {
        let ret = []
        let accum = ''
        for (const text of texts) {
            if (text.str === ' ') {
                ret.push(accum)
                accum = ''
            } else {
                accum += text.str
            }
        }
        if (accum != '') {
            ret.push(accum)
        }
        return ret
    }

    findRow(texts: TextContent, location: Location): string[] {
        return this.mergeRow(texts.items.filter(it => (it as TextItem).transform[5] == location.y).map(it => (it as TextItem)))

    }

    findRowByText(texts: TextContent, text: string) {
        return this.findRow(texts, this.getLocation(texts.items[this.findText(texts, text)]))
    }

    getRecipeName(texts: TextContent): string {
        let nameLabelIndex = this.findText(texts, "Recipe Name:")
        //skip the name and space
        nameLabelIndex += 2
        let accum = ''
        while ((texts.items[nameLabelIndex] as TextItem).str != ' ') {
            accum += (texts.items[nameLabelIndex] as TextItem).str
            nameLabelIndex++
        }
        return accum
    }


    async parse(document: PDFDocumentProxy): Promise<Recipe> {
        const page = await document.getPage(1)
        const texts = await page.getTextContent({ includeMarkedContent: false })
        const name = this.getRecipeName(texts)

        const waterRow = this.findRowByText(texts, "^Water$")
        const lyeRow = this.findRowByText(texts, "^Lye -")
        const fragranceRow = this.findRowByText(texts, "^Fragrance$")


        const oilTableStart = this.findText(texts, "#")
        const oilTableStop = this.findText(texts, "Soap Bar Quality")


        const oilTableTexts = texts.items.slice(oilTableStart, oilTableStop - 1)
        const oilTableRowStarts = oilTableTexts.filter(text => (text as TextItem).str == '')

        const oilTableRows = oilTableRowStarts.map(text => this.findRow(texts, this.getLocation(text)))

        const oils : Oil[] = []

        for (const [i, row] of oilTableRows.entries()) {
            if (row[0] != String(i+1)) {
                break
            }
            oils.push({
                grams: Number(row.pop()),
                name: row[1]
            })
        }
        
        return {
            name,
            oils,
            fragranceAmount: Number(fragranceRow.pop()),
            lyeAmount: Number(lyeRow.pop()),
            waterAmount: Number(waterRow.pop()),
            additionalIngredients: []
        }
    }

}

const htmlParser = new HTMLParser()
const pdfParser = new PDFParser()

export function parseRecipe(document: Document | PDFDocumentProxy): Promise<Recipe> {
    if (document instanceof Document) {
        return htmlParser.parse(document)
    } else {
        return pdfParser.parse(document)
    }
}
