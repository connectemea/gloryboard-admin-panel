import React from "react";
import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/useModel";
import { Button } from "@/components/ui/button";
import { Award, Eye } from "lucide-react";

function CollegeResultViewModal({ data = {} }) {
    const { isOpen, openModal, closeModal } = useModel();
    console.log(data);
    const handleCloseDialog = () => {
        // formik.resetForm();
        closeModal();
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => (open ? openModal() : handleCloseDialog())}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-8 h-8" size="icon">
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{data?.college}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-[400px] overflow-auto" >
                {data.events.map((item)=>
                    <div className="border rounded px-2 py-1 flex flex-col" >
                        <span className="text-lg font-semibold text-gray-300">
                        {item.event}
                        </span>
                        <div className="flex justify-between text-sm text-gray-400" >
                            <span>Position:  {item.position} </span>
                            <span>Score:      {item.score} </span>
                        </div>
                    </div>
                )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CollegeResultViewModal;
