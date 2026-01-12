import React, { useState } from "react";
import { Button } from "../ui/button";
import axiosInstance from "@/api/axiosInstance";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DownloadParticipantCard({ id, name , type = "college" }) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const APIendpoint = type === "all-cards" ? `admin/all-participant-cards` : `admin/participant-cards-compact/${id}`;
  const handleDownloadCards = async () => {
    setLoading(true); // Start the loader
    try {
      // Fetch the PDF file as a blob
      const response = await axiosInstance.get(`${APIendpoint}`, {
        responseType: "blob", // Ensure the response is treated as binary data
      });

      // Create a URL for the blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}_participant-cards.pdf`; // Set the desired file name
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up by revoking the blob URL and removing the link element
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Participant cards exported successfully!");
    } catch (error) {
      console.error("Error exporting participant cards:", error, error.response.status);
      toast.error(
        error.response.status === 404
          ? "No valid registrations found"
          : "Failed to export participant cards. Please try again."
      );
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => !loading && setIsDialogOpen(open)}
    >
      <DialogTrigger onClick={() => setIsDialogOpen(true)}>
        <Button variant="outline" size="icon" className="w-8 h-8" title="Download Participant Cards">
          <Download />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Participant Cards</DialogTitle>
          <DialogDescription className="py-6  text-center flex justify-center items-center flex-col gap-5">
          <FileText className="w-32 h-32 opacity-40" />
          <span>
          You're about to download the participant cards for <b>{name}</b> . Ensure your internet connection is stable to complete the download successfully.
          </span>
          </DialogDescription>
          <Button
            disabled={loading}
            onClick={handleDownloadCards}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Download"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DownloadParticipantCard;
