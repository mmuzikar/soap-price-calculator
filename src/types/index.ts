import { PDFDocumentProxy } from 'pdfjs-dist'

export * from './recipe'
export * from './measurements'
export * from './country'

export type RecipeInputDocument = Document | PDFDocumentProxy

export type Currency = {
    name: string;
    symbol_native: string;
    symbol: string;
    code: string;
    name_plural: string;
    rounding: number;
    decimal_digits: number;
}