import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineTrophy } from "react-icons/ai";
import { MdReplay } from "react-icons/md";
import { TbKeyboard } from "react-icons/tb";

export default function RaceResult({ results }) {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state?.result || 'win';

    return (
        <div className="p-8 md:mt-24 lg:mt-40 flex flex-col items-center">
            <div className="bg-overlay flex md:flex-col md:gap-12 lg:flex-row rounded-2xl md:h-[50vh] lg:h-[30vh] w-[90vw] mx-auto items-center justify-center mb-6">
                <div className="flex items-center gap-4 text-accent">
                    <AiOutlineTrophy className="text-[8rem] font-bold"/>
                    <h2 className="text-6xl font-bold text-accentText">
                        {result === 'win' ? 'you win!' : 'you lose...'}
                    </h2>
                </div>
                <div className="flex md:ml-12 lg:ml-32 gap-8 sm:gap-10 md:gap-14 lg:gap-20 mb-4">
                    <div>
                    <p className="font-bold text-4xl text-accent mb-3">wpm</p>
                    <p className="text-5xl font-bold  text-accentText">100</p>
                    </div>
                    <div>
                    <p className="font-bold text-4xl text-accent mb-3">accuracy</p>
                    <p className="text-5xl font-bold  text-accentText">0%</p>
                    </div>
                </div>
            </div> 
            <div className="flex flex-row justify-center gap-8">
                <button 
                    onClick={() => navigate('/racestarting')}
                    className="flex justify-center"
                >
                    <MdReplay className="items-center font-bold text-accentText text-3xl hover:text-accent"/>
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="flex justify-center"
                >
                    <TbKeyboard className="items-center font-bold text-accentText text-3xl hover:text-accent"/>
                </button>
            </div>
        </div>
    );
}