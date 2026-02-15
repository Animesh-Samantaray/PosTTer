import React from "react";
import {LuHeart} from 'react-icons/lu'
const TopPostCard = ({ key, title, coverImageUrl, views, likes, maxViews }) => {
    const viewPercentage=((views/maxViews)*100).toFixed(0);
  return <div className=" bg-white py-4 flex flex-col gap-3 border-b border-gray-100">
    <div className="flex items-start gap-2">
        <img src={coverImageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0Y8CPlOvI7NkWWfg52LV-24pfbbf1VhfUA&s"} alt="title" className="w-10 h-10 rounded-md object-cover" />
        <h3 className=" text-sm font-medium text-gray-800 line-clamp-2">{title}</h3>
    </div>



    <div className="relative w-full h-1.5 bg-sky-100/60 rounded-full overflow-hidden">
        <div className="h-full bg-linear-to-r from-sky-500 to-cyan-400 rounded-full transition-all  duration-300" style={{width:`${viewPercentage}%`}}>

        </div>
    </div>


    <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-1 text-sm text-black">{views} views</span>
        <span className="flex items-center gap-1 text-sm text-black">
            <LuHeart className="text-[16px] text-gray-500"/>{likes} likes
        </span>
    </div>


  </div>;
};

export default TopPostCard;
