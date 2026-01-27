export default function Select({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'rounded-md border-brand-primary shadow-sm focus:border-brand-primary focus:ring-brand-primary dark:border-brand-primary dark:bg-gray-900 dark:text-gray-300 dark:focus:border-brand-primary dark:focus:ring-brand-primary ' +
                className
            }
        >
            {children}
        </select>
    );
}










