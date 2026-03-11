export default function Select({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'form-control ' +
                className
            }
        >
            {children}
        </select>
    );
}










