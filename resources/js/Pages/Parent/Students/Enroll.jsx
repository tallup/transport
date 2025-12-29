import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import PhoneNumbersInput from '@/Components/PhoneNumbersInput';
import PolicyDisplay from '@/Components/PolicyDisplay';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';

export default function EnrollStudent({ schools = [], policies = {} }) {
    const { auth } = usePage().props;
    const [policiesAcknowledged, setPoliciesAcknowledged] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        // Basic Information
        name: '',
        school_id: '',
        date_of_birth: '',
        home_address: '',
        grade: '',
        
        // Emergency Contacts
        emergency_phone: '',
        emergency_contact_name: '',
        emergency_contact_2_name: '',
        emergency_contact_2_phone: '',
        emergency_contact_2_relationship: '',
        
        // Medical Information
        doctor_name: '',
        doctor_phone: '',
        medical_notes: '',
        
        // Authorized Pickup Persons
        authorized_pickup_persons: [],
        
        // Additional Information
        special_instructions: '',
        
        // Signatures
        authorization_to_transport_signature: '',
        payment_agreement_signature: '',
        liability_waiver_signature: '',
        policies_acknowledged: false,
    });

    const handlePhoneChange = (field, e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setData(field, formatted);
    };

    const handleAuthorizedPickupChange = (index, field, value) => {
        const persons = [...(data.authorized_pickup_persons || [])];
        if (!persons[index]) {
            persons[index] = { name: '', relationship: '', phone: '' };
        }
        persons[index][field] = value;
        setData('authorized_pickup_persons', persons);
    };

    const addAuthorizedPickupPerson = () => {
        const persons = [...(data.authorized_pickup_persons || []), { name: '', relationship: '', phone: '' }];
        setData('authorized_pickup_persons', persons);
    };

    const removeAuthorizedPickupPerson = (index) => {
        const persons = data.authorized_pickup_persons.filter((_, i) => i !== index);
        setData('authorized_pickup_persons', persons);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare submission data with unformatted phones
        const submitData = {
            ...data,
            emergency_phone: unformatPhoneNumber(data.emergency_phone || ''),
            emergency_contact_2_phone: unformatPhoneNumber(data.emergency_contact_2_phone || ''),
            doctor_phone: unformatPhoneNumber(data.doctor_phone || ''),
            authorized_pickup_persons: (data.authorized_pickup_persons || []).map(person => ({
                ...person,
                phone: unformatPhoneNumber(person.phone || '')
            })),
            policies_acknowledged: policiesAcknowledged,
        };
        
        router.post('/parent/students', submitData);
    };

    const renderSection = (title, children, required = false) => (
        <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-4 drop-shadow-lg">
                {title} {required && <span className="text-red-400">*</span>}
            </h2>
            {children}
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Enroll Student" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h1 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
                                Parent Enrollment Packet
                            </h1>
                            <p className="text-white/80 mb-8">
                                Please complete all sections below to enroll your child in our transportation program.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section 1: Child Information */}
                                {renderSection('Child Information', (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Child's Full Name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full glass-input text-white placeholder-gray-300"
                                                required
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className="w-full glass-input text-white placeholder-gray-300"
                                            />
                                            {errors.date_of_birth && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.date_of_birth}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-base font-bold text-white mb-2">
                                                Home Address
                                            </label>
                                            <textarea
                                                value={data.home_address}
                                                onChange={(e) => setData('home_address', e.target.value)}
                                                rows="2"
                                                className="w-full glass-input text-white placeholder-gray-300"
                                            />
                                            {errors.home_address && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.home_address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                School <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                value={data.school_id}
                                                onChange={(e) => setData('school_id', e.target.value)}
                                                className="w-full glass-input text-white bg-white/10 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2"
                                                required
                                            >
                                                <option value="">Select a school</option>
                                                {schools.map((school) => (
                                                    <option key={school.id} value={school.id} className="bg-gray-800 text-white">
                                                        {school.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.school_id && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.school_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Grade
                                            </label>
                                            <input
                                                type="text"
                                                value={data.grade}
                                                onChange={(e) => setData('grade', e.target.value)}
                                                className="w-full glass-input text-white placeholder-gray-300"
                                            />
                                            {errors.grade && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.grade}</p>}
                                        </div>
                                    </div>
                                ), true)}

                                {/* Section 2: Parent/Guardian Information */}
                                {renderSection('Parent/Guardian Information', (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Primary Parent/Guardian Name
                                            </label>
                                            <input
                                                type="text"
                                                value={auth.user.name}
                                                disabled
                                                className="w-full glass-input text-white/70 bg-white/5"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={auth.user.email}
                                                disabled
                                                className="w-full glass-input text-white/70 bg-white/5"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Phone Number(s)
                                            </label>
                                            <PhoneNumbersInput
                                                value={[]}
                                                onChange={(phones) => {
                                                    // Store in user's phone_numbers (would need separate update)
                                                    // For now, we'll handle this separately if needed
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Section 3: Emergency Contacts */}
                                {renderSection('Emergency Contacts', (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Emergency Contact #1</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Name <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.emergency_contact_name}
                                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        required
                                                    />
                                                    {errors.emergency_contact_name && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.emergency_contact_name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Phone <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={data.emergency_phone}
                                                        onChange={(e) => handlePhoneChange('emergency_phone', e)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="(123) 456-7890"
                                                        maxLength="14"
                                                        required
                                                    />
                                                    {errors.emergency_phone && <p className="mt-1 text-sm text-red-300 font-semibold">{errors.emergency_phone}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Emergency Contact #2</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.emergency_contact_2_name}
                                                        onChange={(e) => setData('emergency_contact_2_name', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Relationship</label>
                                                    <input
                                                        type="text"
                                                        value={data.emergency_contact_2_relationship}
                                                        onChange={(e) => setData('emergency_contact_2_relationship', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={data.emergency_contact_2_phone}
                                                        onChange={(e) => handlePhoneChange('emergency_contact_2_phone', e)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="(123) 456-7890"
                                                        maxLength="14"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Child's Doctor</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Doctor Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.doctor_name}
                                                        onChange={(e) => setData('doctor_name', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Doctor's Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={data.doctor_phone}
                                                        onChange={(e) => handlePhoneChange('doctor_phone', e)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="(123) 456-7890"
                                                        maxLength="14"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ), true)}

                                {/* Section 4: Authorized Pickup Persons */}
                                {renderSection('Authorized Pick-Up Persons', (
                                    <div className="space-y-4">
                                        {(data.authorized_pickup_persons || []).map((person, index) => (
                                            <div key={index} className="glass-card p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-white mb-2">Name</label>
                                                        <input
                                                            type="text"
                                                            value={person.name || ''}
                                                            onChange={(e) => handleAuthorizedPickupChange(index, 'name', e.target.value)}
                                                            className="w-full glass-input text-white placeholder-gray-300"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-white mb-2">Relationship</label>
                                                        <input
                                                            type="text"
                                                            value={person.relationship || ''}
                                                            onChange={(e) => handleAuthorizedPickupChange(index, 'relationship', e.target.value)}
                                                            className="w-full glass-input text-white placeholder-gray-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-white mb-2">Phone</label>
                                                        <input
                                                            type="tel"
                                                            value={person.phone || ''}
                                                            onChange={(e) => {
                                                                const formatted = formatPhoneNumber(e.target.value);
                                                                handleAuthorizedPickupChange(index, 'phone', formatted);
                                                            }}
                                                            className="w-full glass-input text-white placeholder-gray-300"
                                                            placeholder="(123) 456-7890"
                                                            maxLength="14"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAuthorizedPickupPerson(index)}
                                                            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-md text-white font-bold transition"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addAuthorizedPickupPerson}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-md text-white font-bold transition"
                                        >
                                            + Add Authorized Pickup Person
                                        </button>
                                    </div>
                                ))}

                                {/* Section 5: Special Instructions & Medical Notes */}
                                {renderSection('Special Instructions & Medical Notes', (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Special Instructions
                                            </label>
                                            <textarea
                                                value={data.special_instructions}
                                                onChange={(e) => setData('special_instructions', e.target.value)}
                                                rows="4"
                                                className="w-full glass-input text-white placeholder-gray-300"
                                                placeholder="Any special instructions for the driver..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-base font-bold text-white mb-2">
                                                Medical Notes
                                            </label>
                                            <textarea
                                                value={data.medical_notes}
                                                onChange={(e) => setData('medical_notes', e.target.value)}
                                                rows="4"
                                                className="w-full glass-input text-white placeholder-gray-300"
                                                placeholder="Any medical conditions or notes..."
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Section 6: Policies & Procedures */}
                                {renderSection('Policies & Procedures', (
                                    <PolicyDisplay
                                        policies={policies}
                                        showCheckbox={true}
                                        onAcknowledge={setPoliciesAcknowledged}
                                    />
                                ), true)}

                                {/* Section 7: Authorization to Transport */}
                                {renderSection('Authorization to Transport', (
                                    <div className="space-y-4">
                                        <div className="glass-card p-4">
                                            <p className="text-white/90 mb-4">
                                                I, the undersigned parent/guardian, authorize On-Time Transportation Services to transport my child to and from school, activities, or other approved locations. I understand transportation is pre-arranged only and not an on-demand service.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Parent/Guardian Signature <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.authorization_to_transport_signature}
                                                        onChange={(e) => setData('authorization_to_transport_signature', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="Type your full name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Date</label>
                                                    <input
                                                        type="text"
                                                        value={new Date().toLocaleDateString()}
                                                        disabled
                                                        className="w-full glass-input text-white/70 bg-white/5"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ), true)}

                                {/* Section 8: Payment Agreement */}
                                {renderSection('Payment Agreement', (
                                    <div className="space-y-4">
                                        <div className="glass-card p-4">
                                            <p className="text-white/90 mb-4">
                                                I understand and agree to the payment terms and conditions. Payments are due as specified, and late payment fees may apply. I acknowledge that late pick-up fees may apply depending on the schedule.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Parent/Guardian Signature <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.payment_agreement_signature}
                                                        onChange={(e) => setData('payment_agreement_signature', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="Type your full name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Date</label>
                                                    <input
                                                        type="text"
                                                        value={new Date().toLocaleDateString()}
                                                        disabled
                                                        className="w-full glass-input text-white/70 bg-white/5"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ), true)}

                                {/* Section 9: Liability Waiver */}
                                {renderSection('Liability Waiver', (
                                    <div className="space-y-4">
                                        <div className="glass-card p-4">
                                            <p className="text-white/90 mb-4">
                                                I understand that On-Time Transportation Services prioritizes safety and follows all state regulations. I agree not to hold the business or driver liable for delays caused by weather, traffic, or events beyond control. I acknowledge transportation involves inherent risks, and I accept responsibility for my child's behavior while being transported.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Parent/Guardian Signature <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.liability_waiver_signature}
                                                        onChange={(e) => setData('liability_waiver_signature', e.target.value)}
                                                        className="w-full glass-input text-white placeholder-gray-300"
                                                        placeholder="Type your full name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">Date</label>
                                                    <input
                                                        type="text"
                                                        value={new Date().toLocaleDateString()}
                                                        disabled
                                                        className="w-full glass-input text-white/70 bg-white/5"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ), true)}

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                                    <Link
                                        href="/parent/dashboard"
                                        className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing || !policiesAcknowledged}
                                    >
                                        {processing ? 'Submitting...' : 'Submit Enrollment'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

