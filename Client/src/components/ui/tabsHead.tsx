import
  {
    TabsContainer,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { ReactElement } from "react"

interface TabsProps
{
  head: {
    value: string;
    label: string;
  }[];
  defaultValue?: string;
  className?: string;
  children: ReactElement;
  onValueChange?: (value: string) => void;
}

export function Tabs ( { head, defaultValue, children, className, onValueChange }: TabsProps )
{
  return (
    <TabsContainer defaultValue={ defaultValue } className={ className } onValueChange={ onValueChange }>
      <div className="w-full">
        <TabsList className="">
          {
            head.map( item => (
              <TabsTrigger value={ item.value }>{ item.label }</TabsTrigger>
            ) )
          }
        </TabsList>
      </div>
      { children }
    </TabsContainer>
  )
}
