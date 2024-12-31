import React, { useState } from 'react'
import { Button } from '../ui/button';
import axiosInstance from '@/api/axiosInstance';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function DownloadAllTickets() {

    const [loading, setLoading] = useState(false);

    const handleDownloadTickets = async () => {
        setLoading(true); // Start the loader
        try {
            // Fetch the PDF file as a blob
            const response = await axiosInstance.get('/org/participant-tickets', {
                responseType: 'blob', // Ensure the response is treated as binary data
            });

            // Create a URL for the blob
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'participant_tickets.pdf'; // Set the desired file name
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up by revoking the blob URL and removing the link element
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Tickets exported successfully!');
        } catch (error) {
            console.error('Error exporting tickets:', error);
            toast.error('Failed to export tickets. Please try again.');
        } finally {
            setLoading(false); // Stop the loader
        }
    };


  return (
    <Button
    disabled={loading}
    onClick={handleDownloadTickets}
>
    {loading ? <>Exporting<Loader2 className="animate-spin" /> </> : 'Export Tickets'}
</Button> 
  )
}

export default DownloadAllTickets