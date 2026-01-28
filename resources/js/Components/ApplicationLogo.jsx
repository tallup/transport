export default function ApplicationLogo({ className }) {
    return (
        <div className={className}>
            <img 
                src="/logo.png" 
                alt="On Time Logo" 
                className="h-10 w-auto object-contain"
            />
        </div>
    );
}

