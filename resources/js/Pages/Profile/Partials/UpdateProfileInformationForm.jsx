import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GlassButton from '@/Components/GlassButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    profile_picture_url,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [profilePreview, setProfilePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_picture: null,
        });

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                return;
            }
            if (file.size > 5 * 1024 * 1024) return;
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        setData('profile_picture', null);
        setProfilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {};
        if (data.profile_picture) {
            options.forceFormData = true;
        }
        patch(route('profile.update'), options);
    };

    return (
        <section className={`p-6 ${className}`}>
            <header>
                <h2 className="text-2xl font-bold text-brand-primary mb-2">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-brand-primary/70 font-semibold">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel value="Profile Picture" className="text-brand-primary font-semibold text-sm mb-2" />
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {(profilePreview || profile_picture_url) ? (
                                <img
                                    src={profilePreview || profile_picture_url}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400/50"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                    <PhotoIcon className="w-10 h-10 text-brand-primary" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                                id="profile_picture"
                            />
                            <label
                                htmlFor="profile_picture"
                                className="px-4 py-2 bg-white/20 border-2 border-yellow-400/70 rounded-lg text-brand-primary font-semibold cursor-pointer hover:bg-white/30 transition"
                            >
                                {profilePreview || profile_picture_url ? 'Change' : 'Upload'}
                            </label>
                            {(profilePreview || data.profile_picture) && (
                                <button
                                    type="button"
                                    onClick={removeProfilePicture}
                                    className="px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 font-semibold hover:bg-red-500/30 transition"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-brand-primary/70 mt-1">JPEG, PNG, GIF. Max 5MB</p>
                    <InputError className="mt-2 text-red-300 font-semibold" message={errors.profile_picture} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="text-brand-primary font-semibold text-sm mb-2" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2 text-red-300 font-semibold" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-brand-primary font-semibold text-sm mb-2" />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <InputError className="mt-2 text-red-300 font-semibold" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-base text-white font-semibold">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-base text-blue-200 underline hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-base font-semibold text-green-300">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 mt-6">
                    <GlassButton disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </GlassButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-base text-white font-semibold">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
