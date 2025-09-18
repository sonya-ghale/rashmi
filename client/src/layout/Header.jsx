import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 z-30 bg-white py-4 px-6
     shadow-md flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={userIcon} alt="userIcon" className="w-8 h-8" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{user?.name || "User"}</span>
          <span className="text-sm font-medium">{user?.role || "-"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end text-sm font-semibold">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>
        <img
          src={settingIcon}
          alt="settingIcon"
          className="w-8 h-8 cursor-pointer"
          onClick={() => dispatch(toggleSettingPopup())}
        />
      </div>
    </header>
  );
};

export default Header;
