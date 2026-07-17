import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
export { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
export { Badge } from "@/components/ui/badge"
export {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export { Kbd, KbdGroup } from "@/components/ui/kbd"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const calloutStyles: Record<string, string> = {
  note: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400",
  tip: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400",
  warning:
    "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400",
  info: "border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 [&_svg]:text-sky-600 dark:[&_svg]:text-sky-400",
  danger:
    "border-red-500/30 bg-red-50/50 dark:bg-red-950/20 [&_svg]:text-red-600 dark:[&_svg]:text-red-400",
}

interface CalloutProps {
  type?: keyof typeof calloutStyles
  title?: string
  children?: React.ReactNode
}

function Callout({
  type = "note",
  title,
  children,
}: CalloutProps): React.ReactNode {
  return (
    <Alert className={cn("my-4", calloutStyles[type])}>
      {title !== undefined && <AlertTitle>{title}</AlertTitle>}
      {children !== undefined && (
        <AlertDescription>{children}</AlertDescription>
      )}
    </Alert>
  )
}

export { ListingCard } from "@/components/listing/listing-card"
export { Callout }
