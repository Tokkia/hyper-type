import { useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdReplay } from "react-icons/md";

export default function PracticeResult({ wpm, accuracy, time }) {
    const navigate = useNavigate();

    return (
        <div className="p-8 mt-40 flex flex-col items-center">
            <div className="bg-overlay rounded-2xl h-[25vh] w-[90vw] mx-auto flex items-center justify-center mb-8">
                <div className="flex items-center gap-4 text-accent text-9xl font-bold ">
                    <FaRegUser />
                    <h2 className="text-4xl font-bold text-accentText">username</h2>
                </div>
                <div className="flex md:ml-12 lg:ml-32 gap-8 sm:gap-10 md:gap-14 lg:gap-20">
                    <div>
                    <p className="font-bold text-3xl text-accent mb-3">wpm</p>
                    <p className="text-5xl font-bold  text-accentText">100</p>
                    </div>
                    <div>
                    <p className="font-bold text-3xl text-accent mb-3">accuracy</p>
                    <p className="text-5xl font-bold  text-accentText">0%</p>
                    </div>
                </div>
            </div> 
            <button 
                onClick={() => navigate('/')}
                className="flex justify-center"
            >
                <MdReplay className="items-center font-bold text-accentText text-3xl hover:text-accent"/>
            </button>
        </div>
    );
}