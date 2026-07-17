"use client"

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
} from "react"
import { cn } from "@/lib/utils"

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>
    const { children } = el.props

    if (typeof children === "string") {
      return children
    }
    if (Array.isArray(children)) {
      return children.map(getTextContent).join("")
    }
    if (children) {
      return getTextContent(children)
    }
  }

  return ""
}

function asEl(child: ReactNode): ReactElement<{ children?: ReactNode }> | null {
  return isValidElement(child)
    ? (child as ReactElement<{ children?: ReactNode }>)
    : null
}

export function BlogTable({
  className,
  children,
  ...props
}: React.ComponentProps<"table">): ReactNode {
  const [sort, setSort] = useState<{
    column: number
    dir: "asc" | "desc"
  } | null>(null)

  const handleSort = (column: number) => {
    setSort((prev) => {
      if (prev?.column === column) {
        return { column, dir: prev.dir === "asc" ? "desc" : "asc" }
      }

      return { column, dir: "asc" }
    })
  }

  const childrenArray = Children.toArray(children)

  const enhanced = useMemo(() => {
    return childrenArray.map((child) => {
      const c = asEl(child)

      if (!c) {
        return child
      }

      if (c.type === "thead") {
        const headerRows = Children.toArray(c.props.children)

        return cloneElement(
          c,
          {},
          headerRows.map((row) => {
            const r = asEl(row)

            if (!r) {
              return row
            }
            const headerCells = Children.toArray(r.props.children)

            return cloneElement(
              r,
              {},
              headerCells.map((cell, i) => {
                if (!isValidElement(cell) || cell.type !== "th") {
                  return cell
                }
                const isActive = sort?.column === i
                const th = cell as ReactElement<
                  {
                    children?: ReactNode
                    className?: string
                  } & React.ThHTMLAttributes<HTMLTableCellElement>
                >

                let ariaSort: "ascending" | "descending" | undefined
                let sortIcon = ""

                if (isActive) {
                  ariaSort = sort.dir === "asc" ? "ascending" : "descending"
                  sortIcon = sort.dir === "asc" ? "▲" : "▼"
                }

                return cloneElement(
                  th,
                  {
                    ...th.props,
                    className: cn(
                      th.props.className,
                      "cursor-pointer select-none",
                      isActive && "text-primary"
                    ),
                    onClick: () => {
                      handleSort(i)
                    },
                    "aria-sort": ariaSort,
                  },
                  th.props.children,
                  " ",
                  createElement(
                    "span",
                    { key: "sort-icon", className: "ml-0.5 text-xs" },
                    sortIcon
                  )
                )
              })
            )
          })
        )
      }

      if (c.type === "tbody" && sort !== null) {
        const rows = Children.toArray(c.props.children)
        const sorted = rows.toSorted((a, b) => {
          const ae = asEl(a)
          const be = asEl(b)

          if (!ae || !be) {
            return 0
          }
          const aCells = Children.toArray(ae.props.children)
          const bCells = Children.toArray(be.props.children)
          const aVal = getTextContent(aCells[sort.column])
          const bVal = getTextContent(bCells[sort.column])
          const numA = parseFloat(aVal)
          const numB = parseFloat(bVal)
          const cmp =
            !Number.isNaN(numA) && !Number.isNaN(numB)
              ? numA - numB
              : aVal.localeCompare(bVal)

          return sort.dir === "asc" ? cmp : -cmp
        })

        return cloneElement(c, {}, sorted)
      }

      return c
    })
  }, [childrenArray, sort, handleSort])

  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {enhanced}
      </table>
    </div>
  )
}
