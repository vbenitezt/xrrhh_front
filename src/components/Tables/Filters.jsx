import React from "react";

export default function Filter({column,table}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-1">
            <input
                type="number"
                value={(columnFilterValue)?.[0] ?? ''}
                onChange={e =>
                    column.setFilterValue((old) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-20 h-8 text-xs border rounded shadow"
            />
            <input
                type="number"
                value={columnFilterValue?.[1] ?? ''}
                onChange={e =>
                    column.setFilterValue((old) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
                className="w-20 h-8 text-xs border rounded shadow"
            />
        </div>
    ) : (
        <input
            type="text"
            value={columnFilterValue ?? ''}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Buscar...`}
            className="w-20 h-8 text-xs border rounded shadow"
        />
    )
}