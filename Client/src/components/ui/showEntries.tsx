import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';
import
  {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
  } from './dropdown-menu'; // Ensure these imports are correct
import { Button } from './button'; // Ensure this import is correct
import { cn } from '@/lib/utils';

interface PaginationProps<TData>
{
  table: Table<TData>;
  size?: "default" | "icon" | "sm" | "lg";
  className?: string;
  pageSizes?: number[]; // Add a prop for customizable page sizes
}

const ShowEntries = <TData,> ( { table, size, className, pageSizes = [ 10, 20, 50, 100 ] }: PaginationProps<TData> ) =>
{
  // Manage the selected entries per page
  const [ entries, setEntries ] = useState( table.getState().pagination.pageSize );

  // Handle entries change
  const handleEntriesChange = ( value: string ) =>
  {
    const newPageSize = Number( value );
    setEntries( newPageSize );
    table.setPageSize( newPageSize );
  };

  return (
    <div className="pagination-container">
      {/* Dropdown Menu */ }
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="dropdown" size={ size } className={ cn( className ) }>
            Show { entries } entries
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white shadow-md border rounded-md">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={ String( entries ) } onValueChange={ handleEntriesChange }>
            { pageSizes.map( ( size ) => (
              <DropdownMenuRadioItem key={ size } value={ String( size ) }>
                { size } entries
              </DropdownMenuRadioItem>
            ) ) }
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ShowEntries;
