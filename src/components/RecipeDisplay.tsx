import { Table } from "@rewind-ui/core";
import { Oil, Recipe } from "../types";
import { useUnits } from "../contexts/UnitsContext";

function TableCellDisplay({ name, grams }: { name: string, grams: number }) {
    const { convert, unitsDisplay } = useUnits()

    return <Table.Tr>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{convert(grams).toPrecision(3)} {unitsDisplay}</Table.Td>
    </Table.Tr>
}


export function RecipeDisplay(recipe: Recipe) {
    const { unitsDisplay } = useUnits()

    return <Table hoverable={true} striped>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Amount ({unitsDisplay})</Table.Th>
            </Table.Tr>
        </Table.Thead>
        {/* <TableSeparator name="Oils" /> */}
        <Table.Tbody>
            {recipe.oils.map(oil => <TableCellDisplay {...oil} />)}
            <TableCellDisplay name="Water" grams={recipe.waterAmount} />
            <TableCellDisplay name="Lye" grams={recipe.lyeAmount} />
            {recipe.fragranceAmount && <TableCellDisplay name="Fragrance" grams={recipe.fragranceAmount} />}
        </Table.Tbody>
    </Table>
}