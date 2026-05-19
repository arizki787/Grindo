import { CiTrash, CiPen  } from "react-icons/ci";
import { deleteTaskAction } from "../lib/actions";

export function DeleteTask({ id }: { id: string }) {
    return (
        <>
            <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={id}/>
                <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
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