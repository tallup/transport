import GlassButton from '@/Components/GlassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 p-6 ${className}`}>
            <header>
                <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
                    Delete Account
                </h2>

                <p className="mt-1 text-base text-white/90 font-semibold">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <GlassButton variant="danger" onClick={confirmUserDeletion}>
                Delete Account
            </GlassButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="glass-card p-6 rounded-xl">
                    <form onSubmit={deleteUser} className="space-y-6">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="text-base text-gray-700 font-semibold">
                            Once your account is deleted, all of its resources and
                            data will be permanently deleted. Please enter your
                            password to confirm you would like to permanently delete
                            your account.
                        </p>

                        <div className="mt-6">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-900 font-bold text-base"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full glass-input text-gray-900 placeholder-gray-500"
                                isFocused
                                placeholder="Password"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2 text-red-600 font-semibold"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="glass-button-secondary px-4 py-2 rounded-lg text-base font-bold text-gray-900"
                            >
                                Cancel
                            </button>

                            <GlassButton variant="danger" disabled={processing}>
                                {processing ? 'Deleting...' : 'Delete Account'}
                            </GlassButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}
