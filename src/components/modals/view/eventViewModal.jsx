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
import { convertToDateTime } from "@/utils/dateTime";

function EventViewModal({ data = {} }) {
  const { isOpen, openModal, closeModal } = useModel();

  const handleCloseDialog = () => {
    // formik.resetForm();
    closeModal();
  };

  console.log(data)

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
          <DialogTitle className="truncate max-w-[300px]">{data.name}</DialogTitle>
        </DialogHeader>

        <div className="border p-4 space-y-1 rounded-md">
          <div className="flex items-center">
            <span className="font-semibold text-white/70 pr-2">Type: </span>
            <p className="text-white/70 text-sm">{data.event_type.name}</p>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-white/70 pr-2">Event Category: </span>
            <p className="text-white/70 text-sm">{data.event_category}</p>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-white/70 pr-2">Result Category: </span>
            <p className="text-white/70 text-sm">{data.result_category}</p>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-white/70 pr-2">Participants Limit: </span>
            <p className="text-white/70 text-sm">{`${data.min_participants} - ${data.max_participants}`}</p>
          </div>
          {data?.start_time &&
            <div className="flex items-center">
              <span className="font-semibold text-white/70 pr-2">Scheduled Time: </span>
              <p className="text-white/70 text-sm">{`${convertToDateTime(data?.start_time)} - ${convertToDateTime(data?.end_time)}`}</p>
            </div>
          }
        </div>



      </DialogContent>
    </Dialog>
  );
}

export default EventViewModal;
