import { useState, useEffect } from 'react';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';

export default function PhoneNumbersInput({ value = [], onChange, errors = null, required = false }) {
    const [phoneNumbers, setPhoneNumbers] = useState(value && value.length > 0 ? value : ['']);

    useEffect(() => {
        if (value && value.length > 0) {
            setPhoneNumbers(value);
        } else if (!value || value.length === 0) {
            setPhoneNumbers(['']);
        }
    }, [value]);

    const handlePhoneChange = (index, e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        const newPhones = [...phoneNumbers];
        newPhones[index] = formatted;
        setPhoneNumbers(newPhones);
        
        // Call onChange with unformatted values
        const unformattedPhones = newPhones.map(phone => unformatPhoneNumber(phone)).filter(phone => phone.length > 0);
        onChange(unformattedPhones);
    };

    const addPhoneNumber = () => {
        const newPhones = [...phoneNumbers, ''];
        setPhoneNumbers(newPhones);
    };

    const removePhoneNumber = (index) => {
        if (phoneNumbers.length > 1) {
            const newPhones = phoneNumbers.filter((_, i) => i !== index);
            setPhoneNumbers(newPhones);
            
            // Call onChange with unformatted values
            const unformattedPhones = newPhones.map(phone => unformatPhoneNumber(phone)).filter(phone => phone.length > 0);
            onChange(unformattedPhones);
        }
    };

    return (
        <div className="space-y-2">
            {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e)}
                        className="flex-1 glass-input text-white placeholder-gray-300"
                        placeholder="(123) 456-7890"
                        maxLength="14"
                        required={required && index === 0}
                    />
                    {phoneNumbers.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removePhoneNumber(index)}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-md text-white font-bold transition"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addPhoneNumber}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-md text-white font-bold transition"
            >
                + Add Phone Number
            </button>
            {errors && (
                <p className="text-sm text-red-300 font-semibold">{errors}</p>
            )}
        </div>
    );
}








