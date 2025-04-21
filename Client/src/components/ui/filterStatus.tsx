import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";

interface FilterStatusProps<TData>
{
  table: Table<TData>;
  size?: "default" | "icon" | "sm" | "lg";
  className?: string;
  status: {
    value: string;
    label: string;
  }[];
  column: string;
}

const FilterStatus = <TData,> ( {
  table,
  size,
  className,
  status,
  column,
}: FilterStatusProps<TData> ) =>
{
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="dropdown"
          size={ size }
          className={ cn( className, "border-dashed flex justify-center gap-2" ) }
        >
          <CirclePlus size="16" />
          Status
          { ( () =>
          {
            const filterValue = table.getColumn( column )?.getFilterValue() as string | undefined;
            const selected = status.find( ( f ) => f.value === filterValue )?.label;
            return filterValue && selected ? ` | ${ selected }` : null;
          } )() }

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-md rounded-md">
        <DropdownMenuRadioGroup
          value={ table.getColumn( column )?.getFilterValue() as string }
          onValueChange={ ( value ) =>
            table.getColumn( column )?.getFilterValue() !== value
              ? table.getColumn( column )?.setFilterValue( value )
              : table.getColumn( column )?.setFilterValue( undefined )
          }
        >
          { status.map( ( i, _ ) => (
            <DropdownMenuRadioItem value={ i.value }>
              { i.label }
            </DropdownMenuRadioItem>
          ) ) }
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterStatus;
