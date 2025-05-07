import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

export default function RaceStarting() {
  return (
    <div className="mt-64 flex-col lg:flex-row justify-center flex h-[25vh] gap-12 px-12">
        <div className="bg-overlay lg:w-[40vw] h-auto lg:h-[30vh] rounded-2xl flex flex-col justify-center text-left text-7xl font-bold gap-12 px-10 py-12 lg:px-24">
            <div className="flex flex-row items gap-8">
              <FaRegUser />
              <h className="mt-2 text-2xl text-accentText">
                username
              </h>
            </div>
            <div className="flex flex-row items gap-8">
              <RiRobot2Line />
              <h className="mt-2 text-2xl text-accentText">
                bot
              </h>
            </div>
        </div>

        <div className="h-auto lg:h-[30vh] flex flex-col w-[80] gap-10">
          <div className="bg-overlay text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center  gap-10 py-1">
            <p className='text-accentText mr-10'>difficulty</p>
            <button 
            className=" text-accentText hover:text-accent ">
              easy</button>
            <button 
              className=" text-accentText hover:text-accent ">
              medium</button>
            <button
              className=" text-accentText hover:text-accent ">
              hard</button>
          </div>
          <div className="bg-overlay mb-6 text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center gap-10 py-1">
              <p className='text-accentText mr-24'>timer</p>
              <button 
              className=" text-accentText hover:text-accent mr-6">
                15</button>
              <button 
                className=" text-accentText hover:text-accent mr-6">
                30</button>
              <button
                className=" text-accentText hover:text-accent ">
                60</button>
            </div>
            <div className="bg-accent text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center justify-center gap-10 py-1">
              <button 
              className=" text-background font-bold hover:overlay ">
                start race!</button>
            </div>
        </div>

    </div>
  );
}