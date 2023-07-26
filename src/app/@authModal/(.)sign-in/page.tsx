import CloseModal from '@/components/CloseModal';
import SignIn from '@/components/SignIn';

export default function ModalSignIn() {
    return (
        <div className="fixed inset-0 bg-zinc-900/20 z-10 flex items-center justify-center">
            <div className="flex items-center max-w-lg relative bg-white py-20 px-2 rounded-lg">
                <div className="absolute top-4 right-4">
                    <CloseModal />
                </div>
                <SignIn />
            </div>
        </div>
    );
}
