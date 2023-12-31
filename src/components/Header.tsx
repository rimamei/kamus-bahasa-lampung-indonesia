"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { FiSun } from "react-icons/fi";
import { MdOutlineNightlight } from "react-icons/md";

import { cn } from "@/utils/style";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      data-testid="header"
      className="bg-blur sticky top-0 border-b border-gray-100 bg-white shadow dark:border-gray-900 dark:bg-zinc-700"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between p-4">
        <div className="flex items-center">
          <Image
            width={70}
            height={70}
            src="/siger.svg"
            alt="siger"
            className="mr-4 object-cover"
          />
          <h1 className="font-semibold">
            Kamus <br /> Indonesia - Lampung
          </h1>
        </div>
        <div className="flex items-center">
          <div className="mx-6 flex rounded-full bg-gray-300 dark:bg-gray-500">
            <div
              data-testid="light-theme"
              className={cn(
                "cursor-pointer rounded-full p-2",
                (mounted && theme === "light") || "system" ? "bg-primary" : "",
              )}
              onClick={() => setTheme("light")}
            >
              <FiSun />
            </div>
            <div
              data-testid="dark-theme"
              className={cn(
                "cursor-pointer rounded-full p-2",
                mounted && theme === "dark" ? "bg-primary" : "",
              )}
              onClick={() => setTheme("dark")}
            >
              <MdOutlineNightlight />
            </div>
          </div>
          <Link
            href="https://github.com/rimamei/kamus-bahasa-lampung-indonesia"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <BsGithub size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
