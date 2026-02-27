import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    processing?: boolean;
}

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'هل أنت متأكد من الحذف؟',
    description = 'لا يمكن الغاء هذا الإجراء، سيتم حذف البيانات بشكل نهائي.',
    confirmText = 'نعم، حذف',
    cancelText = 'إلغاء',
    processing = false,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-2 text-center w-full">
                        <DialogTitle className="text-xl font-bold text-center block w-full">{title}</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-center block w-full">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 flex flex-row justify-center gap-4 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 sm:max-w-[120px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 sm:max-w-[120px]"
                    >
                        {processing ? 'جاري...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
