export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/30 bg-white/20 backdrop-blur-sm text-indigo-600 shadow-sm focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
