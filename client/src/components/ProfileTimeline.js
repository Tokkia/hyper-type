export default function ProfileTimeline({timeline}) {
    const numbers = Array.from({ length: 18 }, (_, i) => i * 10);
    return(  
        <div className="max-w-[95rem] mx-auto h-[33vh] bg-black flex items-start gap-6">
            <div className="relative flex items-start">  
                <span
                    className="transform -rotate-90 text-base font-bold text-accent"
                >
                    words per minute
                </span>

                <div className="flex flex-col items-start">
                    {numbers.map((num) => (
                    <span key={num} className="text-sm font-medium text-accentText">
                        {num}
                    </span>
                    ))}
                </div>
            </div>


            <div className="flex-1 h-[33vh] px-40 py-10 rounded-2xl bg-overlay flex items-center gap-6">
            </div>
        </div>
    );
}