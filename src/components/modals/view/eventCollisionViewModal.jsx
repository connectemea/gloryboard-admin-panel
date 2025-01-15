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
import { Eye } from "lucide-react";

function EventCollisionViewModal({ data = [] }) {
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
          <DialogTitle className="truncate max-w-[300px]">
            {data.event?.name}
          </DialogTitle>
        </DialogHeader>

        <span className="font-bold text-white/70">Participants</span>

        <div className="overflow-y-auto space-y-2 max-h-[400px]">
        {data.map((participant, index) => (
          <div key={index} className="border rounded-md p-2">
            <div className="flex items-center gap-2">
            <div>{participant.participant_name}</div>
            <span className="text-gray-500 text-xs">
              {participant.course} {participant.year_of_study}yr{" "}
            </span>
            </div>
            <span className="text-gray-500 ">{participant.college}</span>
            <div className="">
              <span className=" text-white/70 pb-2 pr-2">Collisions Events:</span>
              <div className="pl-2 flex flex-col text-red-500">
                {participant.collisions.map((event, index) => (
                  <div key={index}>{event}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {data.map((participant, index) => (
          <div key={index} className="border rounded-md p-2">
            <div className="flex items-center gap-2">
            <div>{participant.participant_name}</div>
            <span className="text-gray-500 text-xs">
              {participant.course} {participant.year_of_study}yr{" "}
            </span>
            </div>
            <span className="text-gray-500 ">{participant.college}</span>
            <div className="">
              <span className=" text-white/70 pb-2 pr-2">Collisions Events:</span>
              <div className="pl-2 flex flex-col text-red-500">
                {participant.collisions.map((event, index) => (
                  <div key={index}>{event}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
         {data.map((participant, index) => (
          <div key={index} className="border rounded-md p-2">
            <div className="flex items-center gap-2">
            <div>{participant.participant_name}</div>
            <span className="text-gray-500 text-xs">
              {participant.course} {participant.year_of_study}yr{" "}
            </span>
            </div>
            <span className="text-gray-500 ">{participant.college}</span>
            <div className="">
              <span className=" text-white/70 pb-2 pr-2">Collisions Events:</span>
              <div className="pl-2 flex flex-col text-red-500">
                {participant.collisions.map((event, index) => (
                  <div key={index}>{event}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
        </div>

        

      </DialogContent>
    </Dialog>
  );
}

export default EventCollisionViewModal;
