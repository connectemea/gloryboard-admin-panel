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

function ResultViewModal({ data = {} }) {
  const { isOpen, openModal, closeModal } = useModel();

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
          <DialogTitle>{data.event?.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* {console.log(data)} */}
        {data.winningRegistrations.map((item, index) => {
          return (
            <div className="flex " key={index}>
              {" "}
              <span className="font-bold text-lg items-center mr-2 flex">
                {" "}
                {item.position} <Award />{" "}
              </span>
              {!data.event?.event_type.is_group == true
                ? <span>{item.eventRegistration?.participants[0].user.name} <span className="text-gray-500 text-xs font-normal"> {item.eventRegistration?.participants[0].user.department} {item.eventRegistration?.participants[0].user.year_of_study}yr </span> </span>
                : item.eventRegistration.group_name}
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}

export default ResultViewModal;
