"use client";

import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LiaExchangeAltSolid } from "react-icons/lia";

import { lampung_v2 } from "@/app/fonts";
import { TranslationResponseType } from "@/lib/type";
import { convertToLampungAlphabet } from "@/utils/convertToLampungAlphabet";
import { cn } from "@/utils/style";

import SearchInput from "./SearchInput";

type TranslationProps = {
  data: TranslationResponseType;
};

const Translation = ({ data }: TranslationProps) => {
  const [isExpand, setIsExpand] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const urlText = searchParams.get("text");

  const [text, setText] = useState("");
  const [lang, setLang] = useState({
    og: "id",
    tl: "lpg",
  });

  useEffect(() => {
    if (urlText) {
      setText(urlText || "");
    }
  }, [urlText]);

  useEffect(() => {
    if (urlLang) {
      setLang({
        og: urlLang || "id",
        tl: urlLang === "id" ? "lpg" : "id",
      });
    }
  }, [urlLang]);

  let lengthOtherTrans = data?.data?.length;

  if (data?.data?.length > 3) {
    lengthOtherTrans = 4;
  }

  const navigate = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };

  const handleTextChange = debounce((e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setText(value);
    setIsExpand(false);

    navigate(`/?lang=${lang.og}&text=${value}`);
  }, 500);

  const handleLangChange = () => {
    const value = {
      og: lang.og === "id" ? "lpg" : "id",
      tl: lang.tl === "id" ? "lpg" : "id",
    };

    router.push(`/?lang=${value.og}`);

    setLang(value);
    setText("");
    setIsExpand(false);
  };

  return (
    <div
      data-testid="translation"
      className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-4 md:space-y-0"
    >
      <div className="w-full md:w-1/2">
        <SearchInput
          lang={lang.og}
          placeholder="Masukkan text..."
          onChange={handleTextChange}
          defaultValue={text}
          data-testid="input"
        />
      </div>
      <div
        onClick={handleLangChange}
        data-testid="language-change"
        className="h-fit w-fit cursor-pointer rounded-full bg-primary p-2 hover:bg-orange-300 dark:border-gray-100 dark:bg-zinc-500 dark:shadow-2xl"
      >
        <LiaExchangeAltSolid
          size={20}
          className="mx-4 rotate-90 text-white md:rotate-0"
        />
      </div>
      <div className="w-full md:w-1/2">
        <h1
          data-testid="lang-output"
          className="mb-2 w-full rounded-full border-primary bg-primary p-2 text-center text-white dark:border-gray-100 dark:bg-zinc-500 dark:shadow-2xl"
        >
          {lang.tl === "id" ? "Indonesia" : "Lampung"}
        </h1>
        <div className="min-h-[150px] w-full min-w-[269px] rounded-xl border border-gray-100 bg-gray-100 p-6 shadow outline-none dark:bg-zinc-600">
          {text === "" ? (
            <p className="text-gray-400" data-testid="default">
              Terjemahan
            </p>
          ) : isPending ? (
            <p className="text-gray-400">Sedang menerjemahkan...</p>
          ) : data.message !== "Data is not found" ? (
            <>
              <p data-testid="translation-word">
                {lang.tl === "id" ? data.data[0].idkata : data.data[0].lpgkata}

                {lang.tl === "lpg" && data.data[0]?.lpgdialek && (
                  <span className="font-bold">
                    (Dialek {data.data[0]?.lpgdialek ?? "-"})
                  </span>
                )}
              </p>
              {lang.tl === "lpg" && data?.data[0]?.lpgkata ? (
                <p className={cn("text-4xl", lampung_v2.className)}>
                  {convertToLampungAlphabet(data?.data[0]?.lpgkata)}
                </p>
              ) : (
                ""
              )}
            </>
          ) : data.message === "Data is not found" ? (
            <p data-testid="not-found">Kata tidak ditemukan</p>
          ) : null}
        </div>

        {/* if there's other translation data */}
        {data.message !== "Data is not found" &&
          text &&
          data.data.length > 1 &&
          !isPending && (
            <div className="mt-4 w-full min-w-[269px] rounded-xl border border-gray-100 bg-gray-100 p-6 shadow outline-none dark:bg-zinc-600">
              <div>
                <div className="flex items-start justify-between">
                  <p className="mb-4">Terjemahan lainnya</p>

                  {/* if translations data is more than 4 then render expand */}
                  {data.data.length > 4 && (
                    <div
                      className="flex cursor-pointer items-center rounded-md bg-gray-300 p-1 text-gray-500"
                      onClick={() => setIsExpand(!isExpand)}
                    >
                      <p className="mr-2 h-fit w-fit text-xs">
                        Lebih {isExpand ? "sedikit" : "banyak"}
                      </p>
                      {isExpand ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  )}
                </div>
                <ul className="mx-4 space-y-3">
                  {data.data
                    .slice(1, isExpand ? data.data.length : lengthOtherTrans)
                    .map((item) => (
                      <li className="list-disc" key={item.id}>
                        <p>
                          {lang.tl === "id" ? item.idkata : item.lpgkata}{" "}
                          {lang.tl === "lpg" && item?.lpgdialek && (
                            <span className="font-bold">
                              (Dialek {item?.lpgdialek ?? "-"})
                            </span>
                          )}
                        </p>
                        {lang.tl === "lpg" ? (
                          <span
                            className={cn("text-4xl", lampung_v2.className)}
                          >
                            {convertToLampungAlphabet(
                              item?.lpgaksara ?? item?.lpgkata ?? "",
                            )}
                          </span>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Translation;
