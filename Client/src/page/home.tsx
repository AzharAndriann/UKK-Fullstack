import * as React from "react"
import
{
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Archive, ArrowUpDown, Check, MoreHorizontal, Pen, PlusCircle, Search, SquarePen, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import
{
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ShowEntries from "@/components/ui/showEntries";
import FilterStatus from "@/components/ui/filterStatus"
import { Tabs } from "@/components/ui/tabsHead"
import { TabsContent } from "@/components/ui/tabs"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import dayjs from "dayjs"
import
{
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Link, useNavigate } from "react-router-dom"
import
{
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArchiveTaskSchema, CompleteTaskSchema } from "@/schemas/task"
import toast from "react-hot-toast"
import axios from "axios"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


export type Task = {
  taskId: string
  taskName: string
  priority: "Low" | "Medium" | "High"
  deadline: Date
}

export const HomePage = () =>
{
  const navigate = useNavigate()

  const { data: taskOnGoing, mutate: mutateOnGoing } = useSWR(
    "http://localhost:5000/api/tasks/onGoing",
    fetcher
  );
  const { data: taskOverdue, mutate: mutateOverdue } = useSWR(
    "http://localhost:5000/api/tasks/overdue",
    fetcher
  );
  const { data: taskComplete, mutate: mutateComplete } = useSWR(
    "http://localhost:5000/api/tasks/complete",
    fetcher
  );


  // const onSubmit = () => {
  //   console.log("pam");
  // };


  const onSubmitComplete = async ( values: z.infer<typeof CompleteTaskSchema> ) =>
  {
    try
    {
      const data = {
        taskId: values.taskId,
        isComplete: values.isComplete
      };
      await axios.patch( "http://localhost:5000/api/task/completeTask", data );
      mutateOnGoing()
      mutateOverdue()
      mutateComplete()
      toast.success( "Task successfully complete!" );
      navigate( "/" );
    } catch ( error )
    {
      console.log( "AXIOS ERROR : ", error );
      toast.error( "Request error" );
    }
    // console.log(values)
  };

  // const onSubmit = () => {
  //   console.log("pam");
  // }; 

  const formComplete = useForm<z.infer<typeof CompleteTaskSchema>>( {
    resolver: zodResolver( CompleteTaskSchema ),
    defaultValues: {
      taskId: undefined,
      isComplete: undefined
    },
  } );


  const onSubmitArchive = async ( values: z.infer<typeof ArchiveTaskSchema> ) =>
  {
    try
    {
      const data = {
        taskId: values.taskId,
        isArchive: values.isArchive
      };
      await axios.patch( "http://localhost:5000/api/task/archiveTask", data );
      mutateOnGoing()
      mutateOverdue()
      mutateComplete()
      toast.success( "Task successfully archive!" );
      navigate( "/" );
    } catch ( error )
    {
      console.log( "AXIOS ERROR : ", error );
      toast.error( "Request error" );
    }
    // console.log(values)
  };

  const formArchive = useForm<z.infer<typeof ArchiveTaskSchema>>( {
    resolver: zodResolver( ArchiveTaskSchema ),
    defaultValues: {
      taskId: undefined,
      isArchive: undefined
    },
  } );

  const columnsTaskOnGoing: ColumnDef<Task>[] = [
    {
      accessorKey: "number",
      header: "No",
      cell: ( { row } ) => (
        <div className="capitalize">{ row.index + 1 }</div>
      ),
      // enableSorting: false,
      // enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "taskName",
      header: "Task",
      cell: ( { row } ) =>
      {
        const task = row.original.taskName
        return (
          <div className="capitalize">{ task }</div>
        )
      },
      // enableSorting: false,
      // enableHiding: false,
      size: 120,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ( { row } ) =>
      {
        const priority = row.original.priority
        return (
          <div className="capitalize">{ priority }</div>
        )
      },
    },
    {
      accessorKey: "deadline",
      header: ( { column } ) =>
      {
        return (
          <Button
            variant="ghost"
            onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
          >
            Deadline
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ( { row } ) =>
      {
        // const deadline = dayjs( row.original.deadline ).format( "YYYY-MM-DD" )
        const deadline = dayjs( row.original.deadline ).format( "DD MMMM YYYY" )
        return (
          <div className="capitalize ms-3">{ deadline }</div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ( { row } ) =>
      {
        const taskId = row.original.taskId
        const taskName = row.original.taskName
        const [ isDialogComplete, setIsDialogComplete ] = React.useState( false )
        const [ isDialogArchive, setIsDialogArchive ] = React.useState( false )
        const [ isDialogDelete, setIsDialogDelete ] = React.useState( false )

        const handleDialogComplete = () =>
        {
          setIsDialogComplete( !isDialogComplete )
        }

        const handleDialogDelete = () =>
        {
          setIsDialogDelete( !isDialogDelete )
        }

        const handleDialogArchive = () =>
        {
          setIsDialogArchive( !isDialogArchive )
        }

        React.useEffect( () =>
        {
          if ( isDialogComplete )
          {
            formComplete.setValue( "taskId", +taskId )
            formComplete.setValue( "isComplete", 1 )
          }
        }, [ formComplete, isDialogComplete ] )

        React.useEffect( () =>
        {
          if ( isDialogArchive )
          {
            formArchive.setValue( "taskId", +taskId )
            formArchive.setValue( "isArchive", 1 )
          }
        }, [ formArchive, isDialogArchive ] )

        const handleDeleteTask = async ( taskId: number ) =>
        {
          try
          {
            await axios.delete( `http://localhost:5000/api/task/${ taskId }` );
            toast.success( "Task berhasil dihapus!" );
            mutateOnGoing()
            mutateOverdue()
            mutateComplete()

          } catch ( error )
          {
            console.error( "Delete error: ", error );
            toast.error( "Gagal menghapus task!" );
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white rounded-md shadow-lg p-2">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link
                  to="/save"
                  state={ { taskId: taskId } }
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black text-sm font-normal rounded-md"
                >
                  Edit Task
                </Link>
                <Button variant="delete" onClick={ handleDialogDelete }> Delete</Button>
                <Button variant="dialog" onClick={ handleDialogComplete }> Complete Task</Button>
                <Button variant="dialog" onClick={ handleDialogArchive }> Archive Task</Button>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Dialog for delete task */ }
            <Dialog open={ isDialogDelete } onOpenChange={ handleDialogDelete }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to delete task { taskName }?
                  </DialogDescription>
                  <div className="flex items-center justify-end">
                    <Button type="submit" className="flex items-center gap-2 w-4/12 py-2 bg-red-500 hover:bg-red-400" onClick={ () => handleDeleteTask( +taskId ) }>
                      <Trash size={ 20 } />
                      Delete
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Dialog for complete task */ }
            <Dialog open={ isDialogComplete } onOpenChange={ handleDialogComplete }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Complete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to complete task { taskName }?
                  </DialogDescription>
                  <Form { ...formComplete }>
                    <form onSubmit={ formComplete.handleSubmit( onSubmitComplete ) }
                      id="completeTask"
                      className="">
                      {/* Task ID */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formComplete.control }
                          name="taskId"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Task ID</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      {/* Is Complete */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formComplete.control }
                          name="isComplete"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Is Complete</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-end py-4">
                        <Button type="submit" className="flex items-center gap-2 w-4/12 py-5">
                          <Check size={ 20 } />
                          Complete
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Dialog for archive task */ }
            <Dialog open={ isDialogArchive } onOpenChange={ handleDialogArchive }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Archive Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to archive task { taskName }?
                  </DialogDescription>
                  <Form { ...formArchive }>
                    <form onSubmit={ formArchive.handleSubmit( onSubmitArchive ) }
                      id="archiveTask"
                      className="">
                      {/* Task ID */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="taskId"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Task ID</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      {/* Is Complete */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="isArchive"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Is Archive</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-end py-4">
                        <Button type="submit" className="flex items-center gap-2 w-4/12 py-5">
                          <Archive size={ 20 } />
                          Archive
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )
      },
    },
  ]

  const columnsTaskOverdue: ColumnDef<Task>[] = [
    {
      accessorKey: "number",
      header: "No",
      cell: ( { row } ) => (
        <div className="capitalize">{ row.index + 1 }</div>
      ),
      // enableSorting: false,
      // enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "taskName",
      header: "Task",
      cell: ( { row } ) =>
      {
        const task = row.original.taskName
        return (
          <div className="capitalize">{ task }</div>
        )
      },
      // enableSorting: false,
      // enableHiding: false,
      size: 120,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ( { row } ) =>
      {
        const priority = row.original.priority
        return (
          <div className="capitalize">{ priority }</div>
        )
      },
    },
    {
      accessorKey: "deadline",
      header: ( { column } ) =>
      {
        return (
          <Button
            variant="ghost"
            onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
          >
            Deadline
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ( { row } ) =>
      {
        const deadline = dayjs( row.original.deadline ).format( "DD MMMM YYYY" )
        return (
          <div className="capitalize ms-3">{ deadline }</div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ( { row } ) =>
      {
        const taskId = row.original.taskId
        const taskName = row.original.taskName
        const [ isDialogComplete, setIsDialogComplete ] = React.useState( false )
        const [ isDialogArchive, setIsDialogArchive ] = React.useState( false )
        const [ isDialogDelete, setIsDialogDelete ] = React.useState( false )

        const handleDialogComplete = () =>
        {
          setIsDialogComplete( !isDialogComplete )
        }

        const handleDialogDelete = () =>
        {
          setIsDialogDelete( !isDialogDelete )
        }

        const handleDialogArchive = () =>
        {
          setIsDialogArchive( !isDialogArchive )
        }

        React.useEffect( () =>
        {
          if ( isDialogComplete )
          {
            formComplete.setValue( "taskId", +taskId )
            formComplete.setValue( "isComplete", 1 )
          }
        }, [ formComplete, isDialogComplete ] )

        React.useEffect( () =>
        {
          if ( isDialogArchive )
          {
            formArchive.setValue( "taskId", +taskId )
            formArchive.setValue( "isArchive", 1 )
          }
        }, [ formArchive, isDialogArchive ] )

        const handleDeleteTask = async ( taskId: number ) =>
        {
          try
          {
            await axios.delete( `http://localhost:5000/api/task/${ taskId }` );
            toast.success( "Task berhasil dihapus!" );
            mutateOnGoing()
            mutateOverdue()
            mutateComplete()

          } catch ( error )
          {
            console.error( "Delete error: ", error );
            toast.error( "Gagal menghapus task!" );
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link
                  to="/save"
                  state={ { taskId: taskId } }
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black text-sm font-normal rounded-md"
                >
                  Edit Task
                </Link>
                <Button variant="delete" onClick={ handleDialogDelete }> Delete</Button>
                <Button variant="dialog" onClick={ handleDialogComplete }> Complete Task</Button>
                <Button variant="dialog" onClick={ handleDialogArchive }> Archive Task</Button>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Dialog for delete task */ }
            <Dialog open={ isDialogDelete } onOpenChange={ handleDialogDelete }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to delete task { taskName }?
                  </DialogDescription>
                  <div className="flex items-center gap-3 justify-end py-4">
                    <Button type="submit" className="flex items-center gap-2 w-4/12 py-5 bg-red-500 hover:bg-red-400" onClick={ () => handleDeleteTask( +taskId ) }>
                      <Trash size={ 20 } />
                      Delete
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Dialog for complete task */ }
            <Dialog open={ isDialogComplete } onOpenChange={ handleDialogComplete }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Complete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to complete task { taskName }?
                  </DialogDescription>
                  <Form { ...formComplete }>
                    <form onSubmit={ formComplete.handleSubmit( onSubmitComplete ) }
                      id="completeTask"
                      className="">
                      {/* Task ID */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formComplete.control }
                          name="taskId"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Task ID</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      {/* Is Complete */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formComplete.control }
                          name="isComplete"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Is Complete</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-end py-4">
                        <Button type="submit" className="flex items-center gap-2 w-4/12 py-5">
                          <Check size={ 20 } />
                          Complete
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Dialog for archive task */ }
            <Dialog open={ isDialogArchive } onOpenChange={ handleDialogArchive }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Archive Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to archive task { taskName }?
                  </DialogDescription>
                  <Form { ...formArchive }>
                    <form onSubmit={ formArchive.handleSubmit( onSubmitArchive ) }
                      id="archiveTask"
                      className="">
                      {/* Task ID */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="taskId"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Task ID</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      {/* Is Complete */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="isArchive"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Is Archive</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-end py-4">
                        <Button type="submit" className="flex items-center gap-2 w-4/12 py-5">
                          <Archive size={ 20 } />
                          Archive
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )
      },
    },
  ]

  const columnsTaskComplete: ColumnDef<Task>[] = [
    {
      accessorKey: "number",
      header: "No",
      cell: ( { row } ) => (
        <div className="capitalize">{ row.index + 1 }</div>
      ),
      // enableSorting: false,
      // enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "taskName",
      header: "Task",
      cell: ( { row } ) =>
      {
        const task = row.original.taskName
        return (
          <div className="capitalize">{ task }</div>
        )
      },
      // enableSorting: false,
      // enableHiding: false,
      size: 120,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ( { row } ) =>
      {
        const priority = row.original.priority
        return (
          <div className="capitalize">{ priority }</div>
        )
      },
    },
    {
      accessorKey: "deadline",
      header: ( { column } ) =>
      {
        return (
          <Button
            variant="ghost"
            onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
          >
            Deadline
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ( { row } ) =>
      {
        const deadline = dayjs( row.original.deadline ).format( "DD MMMM YYYY" )
        return (
          <div className="capitalize ms-3">{ deadline }</div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ( { row } ) =>
      {
        const taskId = row.original.taskId
        const taskName = row.original.taskName
        const [ isDialogArchive, setIsDialogArchive ] = React.useState( false )
        const [ isDialogDelete, setIsDialogDelete ] = React.useState( false )

        const handleDialogDelete = () =>
        {
          setIsDialogDelete( !isDialogDelete )
        }

        const handleDialogArchive = () =>
        {
          setIsDialogArchive( !isDialogArchive )
        }

        React.useEffect( () =>
        {
          if ( isDialogArchive )
          {
            formArchive.setValue( "taskId", +taskId )
            formArchive.setValue( "isArchive", 1 )
          }
        }, [ formArchive, isDialogArchive ] )

        const handleDeleteTask = async ( taskId: number ) =>
        {
          try
          {
            await axios.delete( `http://localhost:5000/api/task/${ taskId }` );
            toast.success( "Task berhasil dihapus!" );
            mutateOnGoing()
            mutateOverdue()
            mutateComplete()

          } catch ( error )
          {
            console.error( "Delete error: ", error );
            toast.error( "Gagal menghapus task!" );
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Button variant="delete" onClick={ handleDialogDelete }> Delete</Button>
                <Button variant="dialog" onClick={ handleDialogArchive }> Archive Task</Button>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Dialog for delete task */ }
            <Dialog open={ isDialogDelete } onOpenChange={ handleDialogDelete }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to delete task { taskName }?
                  </DialogDescription>
                  <div className="flex items-center gap-3 justify-end py-4">
                    <Button type="submit" className="flex items-center gap-2 w-4/12 py-5 bg-red-500 hover:bg-red-400" onClick={ () => handleDeleteTask( +taskId ) }>
                      <Trash size={ 20 } />
                      Delete
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Dialog for archive task */ }
            <Dialog open={ isDialogArchive } onOpenChange={ handleDialogArchive }>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Archive Task</DialogTitle>
                  <DialogDescription>
                    Are you sure want to archive task { taskName }?
                  </DialogDescription>
                  <Form { ...formArchive }>
                    <form onSubmit={ formArchive.handleSubmit( onSubmitArchive ) }
                      id="archiveTask"
                      className="">
                      {/* Task ID */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="taskId"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Task ID</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      {/* Is Complete */ }
                      <div className="mb-3 hidden">
                        <FormField
                          control={ formArchive.control }
                          name="isArchive"
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormLabel>Is Archive</FormLabel>
                              <FormControl>
                                <Input type="text" { ...field } value={ field.value } readOnly className="bg-gray-100 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-end py-4">
                        <Button type="submit" className="flex items-center gap-2 w-4/12 py-5">
                          <Archive size={ 20 } />
                          Archive
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )
      },
    },
  ]

  const [ sorting, setSorting ] = React.useState<SortingState>( [] )
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>(
    []
  )
  const [ columnVisibility, setColumnVisibility ] =
    React.useState<VisibilityState>( {} )
  const [ rowSelection, setRowSelection ] = React.useState( {} )
  const [ tab, setTab ] = React.useState<string>( "onGoing" );


  const selectedData = tab === "onGoing" ? taskOnGoing : tab === "overdue" ? taskOverdue : taskComplete;
  const columns =
    tab === "onGoing"
      ? columnsTaskOnGoing
      : tab === "overdue"
        ? columnsTaskOverdue
        : columnsTaskComplete;

  const table = useReactTable( {
    data: selectedData ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  } )

  const getPriorityLowOG = taskOnGoing?.filter( ( f: Task ) => f.priority === "Low" )?.length
  const getPriorityMediumOG = taskOnGoing?.filter( ( f: Task ) => f.priority === "Medium" )?.length
  const getPriorityHighOG = taskOnGoing?.filter( ( f: Task ) => f.priority === "High" )?.length

  const getPriorityLowOD = taskOverdue?.filter( ( f: Task ) => f.priority === "Low" )?.length
  const getPriorityMediumOD = taskOverdue?.filter( ( f: Task ) => f.priority === "Medium" )?.length
  const getPriorityHighOD = taskOverdue?.filter( ( f: Task ) => f.priority === "High" )?.length

  const getPriorityLowC = taskComplete?.filter( ( f: Task ) => f.priority === "Low" )?.length
  const getPriorityMediumC = taskComplete?.filter( ( f: Task ) => f.priority === "Medium" )?.length
  const getPriorityHighC = taskComplete?.filter( ( f: Task ) => f.priority === "High" )?.length

  return (
    <div className="bg-white max-w-full h-full rounded-md shadow-md p-5 items-center overflow-auto flex flex-col">
      <div className="grid grid-cols-12 w-full mb-4 gap-2">
        <div className="col-span-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={ ( table.getColumn( "taskName" )?.getFilterValue() as string ) ?? "" }
              onChange={ ( event ) =>
                table.getColumn( "taskName" )?.setFilterValue( event.target.value )
              }
              className="pl-9"
            />
          </div>
        </div>
        <div className="col-span-6"></div>
        <div className="col-span-3">
          <a
            href="/save"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md"
          >
            <PlusCircle size={ 20 } />
            Add New Task
          </a>
        </div>
      </div>
      <div className="flex-none w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 bg-slate-900 text-white py-1 px-[11px] rounded-md shadow-md">
          <div className="flex">
            Low : { tab === "onGoing" ? getPriorityLowOG : tab === "overdue" ? getPriorityLowOD : getPriorityLowC }
          </div>
          |
          <div className="flex">
            Medium : { tab === "onGoing" ? getPriorityMediumOG : tab === "overdue" ? getPriorityMediumOD : getPriorityMediumC }
          </div>
          |
          <div className="flex">
            High : { tab === "onGoing" ? getPriorityHighOG : tab === "overdue" ? getPriorityHighOD : getPriorityHighC }
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <FilterStatus
            size="default"
            className="text-xs"
            table={ table }
            column="priority"
            status={ [
              {
                value: "low",
                label: "Low",
              },
              {
                value: "medium",
                label: "Medium",
              },
              {
                value: "high",
                label: "High",
              },
            ] }
          />
          <ShowEntries size="default" className="text-[13px]" table={ table } />
        </div>
      </div>
      <div className="flex-none w-full flex justify-between items-center mb-2">
        <Tabs
          onValueChange={ ( e ) =>
          {
            setTab( e );
          } }
          head={ [
            {
              value: "onGoing",
              label: "On Going",
            },
            {
              value: "overdue",
              label: "Overdue",
            },
            {
              value: "complete",
              label: "Complete",
            },
          ] }
          className="w-full h-full overflow-hidden flex flex-col"
          defaultValue="onGoing"
        >
          <>
            <TabsContent
              value="onGoing"
              className="w-full overflow-auto h-full"
            >
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    { table.getHeaderGroups().map( ( headerGroup ) => (
                      <TableRow key={ headerGroup.id }>
                        { headerGroup.headers.map( ( header ) =>
                        {
                          return (
                            <TableHead
                              key={ header.id }
                              style={ {
                                minWidth: header.column.columnDef.size,
                                maxWidth: header.column.columnDef.size,
                              } }
                            >
                              { header.isPlaceholder
                                ? null
                                : flexRender( header.column.columnDef.header, header.getContext() ) }
                            </TableHead>
                          );
                        } ) }
                      </TableRow>
                    ) ) }
                  </TableHeader>
                  <TableBody>
                    { table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map( ( row ) => (
                        <TableRow
                          key={ row.id }
                          data-state={ row.getIsSelected() && "selected" }
                        >
                          { row.getVisibleCells().map( ( cell ) => (
                            <TableCell key={ cell.id }>
                              { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                            </TableCell>
                          ) ) }
                        </TableRow>
                      ) )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={ columns.length } className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    ) }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent
              value="overdue"
              className="w-full overflow-auto h-full"
            >
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    { table.getHeaderGroups().map( ( headerGroup ) => (
                      <TableRow key={ headerGroup.id }>
                        { headerGroup.headers.map( ( header ) =>
                        {
                          return (
                            <TableHead
                              key={ header.id }
                              style={ {
                                minWidth: header.column.columnDef.size,
                                maxWidth: header.column.columnDef.size,
                              } }
                            >
                              { header.isPlaceholder
                                ? null
                                : flexRender( header.column.columnDef.header, header.getContext() ) }
                            </TableHead>
                          );
                        } ) }
                      </TableRow>
                    ) ) }
                  </TableHeader>
                  <TableBody>
                    { table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map( ( row ) => (
                        <TableRow
                          key={ row.id }
                          data-state={ row.getIsSelected() && "selected" }
                        >
                          { row.getVisibleCells().map( ( cell ) => (
                            <TableCell key={ cell.id }>
                              { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                            </TableCell>
                          ) ) }
                        </TableRow>
                      ) )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={ columns.length } className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    ) }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent
              value="complete"
              className="w-full overflow-auto h-full"
            >
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    { table.getHeaderGroups().map( ( headerGroup ) => (
                      <TableRow key={ headerGroup.id }>
                        { headerGroup.headers.map( ( header ) =>
                        {
                          return (
                            <TableHead
                              key={ header.id }
                              style={ {
                                minWidth: header.column.columnDef.size,
                                maxWidth: header.column.columnDef.size,
                              } }
                            >
                              { header.isPlaceholder
                                ? null
                                : flexRender( header.column.columnDef.header, header.getContext() ) }
                            </TableHead>
                          );
                        } ) }
                      </TableRow>
                    ) ) }
                  </TableHeader>
                  <TableBody>
                    { table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map( ( row ) => (
                        <TableRow
                          key={ row.id }
                          data-state={ row.getIsSelected() && "selected" }
                        >
                          { row.getVisibleCells().map( ( cell ) => (
                            <TableCell key={ cell.id }>
                              { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                            </TableCell>
                          ) ) }
                        </TableRow>
                      ) )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={ columns.length } className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    ) }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        </Tabs>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#"
                onClick={ () => table.previousPage() }
                className={ table.getCanPreviousPage() ? '' : 'pointer-events-none opacity-50' }
              />
            </PaginationItem>
            { table.getPageOptions().map( ( page, index ) => (
              <PaginationItem key={ index }>
                <PaginationLink
                  href="#"
                  isActive={ page === table.getState().pagination.pageIndex }
                  onClick={ ( e ) =>
                  {
                    e.preventDefault()
                    table.setPageIndex( page )
                  } }
                >
                  { page + 1 }
                </PaginationLink>
              </PaginationItem>
            ) ) }

            { table.getPageCount() > 3 ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <></>
            ) }
            <PaginationItem>
              <PaginationNext href="#"
                onClick={ () => table.nextPage() }
                className={ table.getCanNextPage() ? '' : 'pointer-events-none opacity-50' }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

