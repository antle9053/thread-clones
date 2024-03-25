import { Moon, ArrowLeft, Sun, Check } from "lucide-react";
import { FC, useState } from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/src/shared/infra/zustand";
import {
  arrColors,
  themeColor,
  themeSelectors,
} from "@/src/shared/infra/zustand/slices/themeSlice";
import { Col, Flex, Row } from "antd";

type ApperanceProps = {
  onSetApperance: () => void;
};

export const Apperance: FC<ApperanceProps> = ({ onSetApperance }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [checked, setChecked] = useState<string>(`theme-${currentTheme}`);

  const color = useAppStore(themeSelectors.color);
  const changeColor = useAppStore(themeSelectors.changeColor);

  const handleSwitchTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const themeValue = event.target.value;
    setChecked(event.target.value);
    const theme = themeValue.split("-")[1];
    setTheme(theme);
  };

  const handleChangeColor = (color: themeColor) => {
    changeColor(color);
    document.documentElement.style.setProperty("--primary-color", `#${color}`);
  };

  return (
    <div className="p-4 dark:bg-[#333333] dark:border-white">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={onSetApperance}
          className="cursor-pointer dark:text-white"
        >
          <ArrowLeft strokeWidth={2.5} />
        </div>

        <span className="dark:text-white text-lg font-bold">Apperance</span>
        <div className="w-5"></div>
      </div>
      <div className="mb-6">
        <span className="dark:text-white block mb-4 font-[500]">Dark Mode</span>
        <div className="relative h-[50px] w-[288px] max-w-full flex justify-arround bg-slate-100 dark:bg-black rounded-lg overflow-hidden">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            className="hidden cursor-pointer peer/light"
            value="theme-light"
            onChange={handleSwitchTheme}
            checked={checked === "theme-light"}
          />
          <label
            htmlFor="theme-light"
            className=" w-1/3 h-full z-1 cursor-pointer flex justify-center items-center dark:text-white"
          >
            <Sun />
          </label>

          <input
            type="radio"
            id="theme-dark"
            name="theme"
            className="hidden cursor-pointer peer/dark"
            value="theme-dark"
            onChange={handleSwitchTheme}
            checked={checked === "theme-dark"}
          />
          <label
            htmlFor="theme-dark"
            className=" w-1/3 h-full z-1 cursor-pointer  flex justify-center items-center dark:text-white"
          >
            <Moon />
          </label>

          <input
            type="radio"
            id="theme-system"
            name="theme"
            className="hidden cursor-pointer peer/system"
            value="theme-system"
            onChange={handleSwitchTheme}
            checked={checked === "theme-system"}
          />
          <label
            htmlFor="theme-system"
            className=" w-1/3 h-full z-1 cursor-pointer flex justify-center items-center dark:text-white font-bold text-base"
          >
            Auto
          </label>

          <div className="bg-slate-600 dark:bg-white dark:opacity-50 opacity-20 cursor-pointer rounded-lg left-0 peer-checked/light:left-0 peer-checked/dark:left-1/3 peer-checked/system:left-2/3 absolute border transition-all w-1/3 h-full z-0 ease-in-out duration-300"></div>
        </div>
      </div>
      <div className="mb-2 max-w-[300px]">
        <span className="dark:text-white block mb-4 font-[500]">Theme</span>
        <Flex className="justify-between">
          {arrColors.map((colorItem: themeColor, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full cursor-pointer flex justify-center items-center"
              style={{ backgroundColor: `#${colorItem}` }}
              onClick={() => handleChangeColor(colorItem)}
            >
              {color === colorItem ? (
                <Check color="white" strokeWidth={3} />
              ) : (
                ""
              )}
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
};
