import { CiTrash, CiPen  } from "react-icons/ci";
import { deleteTaskAction } from "../lib/actions";

export function DeleteTask({ id }: { id: string }) {
    return (
        <>
            <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={id}/>
                <button type="submit" className="rounded-xl border border-white/5 p-2 hover:bg-white/10 text-foreground transition-colors bg-white/5">
                    <span className="sr-only">Delete</span>
                    <CiTrash className="w-5 h-5 text-foreground/70" />    
                </button>    
            </form> 
        </>
    )
}
