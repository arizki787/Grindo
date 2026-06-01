import { CiTrash, CiPen  } from "react-icons/ci";
import { deleteTaskAction } from "../lib/actions";

export function DeleteTask({ id }: { id: string }) {
    return (
        <>
            <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={id}/>
                <button type="submit" className="rounded-md border border-olive-green p-2 hover:bg-olive-green text-foreground transition-colors">
                    <span className="sr-only">Delete</span>
                    <CiTrash className="w-5 h-5" />    
                </button>    
            </form> 
        </>
    )
}

// export function UpdateTask({ id }: { id: string}) {
//     return (
//         <
//     )
// }