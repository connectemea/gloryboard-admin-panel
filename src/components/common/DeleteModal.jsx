import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const DeleteModal = ({
    title = "Delete Confirmation",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    onDelete = () => { },
    trigger = "Delete",
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {typeof trigger === "string" ? (
                    <Button
                        variant="outline"
                        className="w-8 h-8 text-red-500"
                        size="icon"
                    >
                        <Trash />
                    </Button>
                ) : (
                    trigger
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;
