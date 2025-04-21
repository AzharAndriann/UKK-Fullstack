import { TaskSchemas } from "@/schemas/task";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, CircleX, FilePlus } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import useSWR from "swr";
import { fetcher } from "@/lib/utils";


export const SavePage = () =>
{
  const navigate = useNavigate()
  const today = dayjs().format( "YYYY-MM-DD" )
  const location = useLocation()
  const taskId = location.state?.taskId

  const { data: task } = useSWR(
    "http://localhost:5000/api/task/" + taskId,
    fetcher
  );

  const onSubmit = async ( values: z.infer<typeof TaskSchemas> ) =>
  {
    try
    {
      if ( taskId )
      {
        if(values.deadline == today || today < values.deadline) {
          // const combined = new Date( `${ values.deadline }T${ values.time }:00` );
        // dayjs( combined ).format( 'YYYY-MM-DD HH:mm:ss' )
        const data = {
          taskId: taskId,
          taskName: values.taskName,
          priority: values.priority,
          deadline: values.deadline
        };

        await axios.put( "http://localhost:5000/api/task/", data );
        console.log( "data" + JSON.stringify( data, null, 2 ) )
        toast.success( "Task successfully update!" );
        navigate( "/" );
        } else {
          toast.error( "Deadline task sudah lewat!" );
          navigate( "/save" );
        }
      } else
      {
        if(values.deadline == today || today < values.deadline) {
          // const combined = new Date( `${ values.deadline }T${ values.time }:00` );
        // dayjs( combined ).format( 'YYYY-MM-DD HH:mm:ss' )
        const data = {
          taskName: values.taskName,
          priority: values.priority,
          deadline: values.deadline
        };

        await axios.post( "http://localhost:5000/api/task", data );
        console.log( "data" + JSON.stringify( data, null, 2 ) )
        toast.success( "Task successfully added!" );
        navigate( "/" );
        } else {
          toast.error( "Deadline task sudah lewat!" );
          navigate( "/save" );
        }
      }
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

  const form = useForm<z.infer<typeof TaskSchemas>>( {
    resolver: zodResolver( TaskSchemas ),
    defaultValues: {
      createDate: today,
      taskName: "",
      priority: "Low",
      deadline: ""
    },
  } );

  React.useEffect( () =>
  {
    if ( task && taskId )
    {
      // const getTask = tasks?.find((f: Task) => f.taskId === taskId)
      form.reset( {
        taskName: task?.taskName,
        priority: task?.priority,
        deadline: dayjs(task?.deadline).format("YYYY-MM-DD")
      } )
      console.log( task?.taskName )
    }
  }, [ task, taskId ] )


  return (
    <Form { ...form }>
      <form
        id="task"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white w-full h-full rounded-md shadow-md p-5 flex flex-col justify-between">
        <div className="">
          {/* Create Date */ }
          <div className="mb-3">
            <FormField
              control={ form.control }
              name="createDate"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Create Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
                      <Input
                        value={ field.value }
                        readOnly
                        className="bg-gray-100 cursor-not-allowed focus-within:outline-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </div>

          {/* Task Name */ }
          <div className="mb-3">
            <FormField
              control={ form.control }
              name="taskName"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Task Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" { ...field } value={ field.value }   />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </div>

          {/* Priority */ }
          <div className="mb-3">
            <FormField
              control={ form.control }
              name="priority"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Priority <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={ ( e ) => field.onChange( e ) }
                      value={ field.value }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </div>

          {/* Priority */ }
          <div className="mb-3">
            <FormField
              control={ form.control }
              name="deadline"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Deadline <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" { ...field } value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end py-4">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition focus:shadow-md focus:shadow-primary text-primary border-[2px] border-primary py-2 px-3 rounded-md"
          >
            <CircleX size={ 20 } />
            Cancel
          </a>
          {/* <Button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex items-center gap-2"
              variant="default"
            >
              <EyeIcon size={20} />
              Preview
            </Button> */}
          <Button type="submit" className="flex items-center gap-2 w-1/12 py-5">
            <FilePlus size={ 20 } />
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

