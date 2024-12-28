import React from 'react';
import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useModel } from '@/hooks/useModel';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';


function EventRegViewModal({ data = {} }) {


    const { isOpen, openModal, closeModal } = useModel();


    const handleCloseDialog = () => {
        // formik.resetForm();
        closeModal();
    };

    const getYear = (year) => {
        switch (year) {
            case 1:
                return '1st Year';
            case 2:
                return '2nd Year';
            case 3:
                return '3rd Year';
            case 4:
                return '4th Year';
            default:
                return 'Not Specified';
        }
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
                    <DialogTitle>
                        {data.event?.name}
                    </DialogTitle>
                </DialogHeader>

                <span className="font-bold text-white/70">Participants</span>
                <div className='border  rounded-md p-2'>
                    {data?.participants.map((participant, index) => (
                        <div key={index} className='flex justify-between'>
                            <p>{participant?.name}</p>
                            <span>
                                {participant?.department}
                            </span>
                            <span>
                                {getYear(participant?.year_of_study)}
                            </span>
                        </div>
                    ))}
                </div>

                {data.helpers.length > 0 && (
                    <>
                        <span className="font-bold text-white/70">Helpers</span>
                        <div className='border  rounded-md p-2'>
                            {data.helpers.map((helper, index) => (
                                <div>{helper.user.name}</div>
                            ))}
                        </div>
                    </>
                )}

            </DialogContent>
        </Dialog>
    );
}

export default EventRegViewModal;
