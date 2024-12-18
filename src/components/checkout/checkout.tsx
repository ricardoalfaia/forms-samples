"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
interface Address {
  city?: string;
  country?: string;
}

const emptyAddress: Address = {
  city: "",
  country: "",
};

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

export function CheckoutForm() {
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState<string | unknown>(null);
  const [touched, setTouched] = useState<Address>({});
  const t = useTranslations("Checkout");

  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (status === STATUS.COMPLETED) {
      setAddress(emptyAddress);
      setStatus(STATUS.IDLE);
    }
  }, [status]);

  function getErrors(address: Address) {
    const result: Address = {};
    if (!address.city) result.city = t("error.city");
    if (!address.country) result.country = t("error.country");
    return result;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setAddress((curAddress) => {
      return {
        ...curAddress,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setTouched((cur) => {
      return { ...cur, [e.target.id]: true };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(STATUS.SUBMITTING);
    // validateAddress();

    if (isValid) {
      try {
        setTimeout(() => setStatus(STATUS.COMPLETED), 1000);
      } catch (error) {
        if (error instanceof Error) {
          setSaveError(error.message);
        }
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  return (
    <>
      <h1 className="text-center text-3xl mt-8">{t("title")}</h1>

      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert" className="text-center mt-4 text-red-600 text-sm">
          <p>{t("error.disclaimer")}</p>
          <ul>
            {Object.keys(errors).map((key: string) => {
              return <li key={key}>{errors[key as keyof typeof address]}</li>;
            })}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-2 flex-col items-center">
          <div>
            <label
              className="text-black font-bold text-lg text-left"
              htmlFor="city"
            >
              {t("city")}
            </label>
            <br />
            <input
              className="border-solid border-2 border-gray-400 w-[450px] h-10 mt-2 mb-2 p-2"
              id="city"
              name="city"
              type="text"
              value={address.city}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={t("placeholder-city")}
            />
            <p className="text-red-600 text-xs">
              {(touched.city || status === STATUS.SUBMITTED) && errors.city}
            </p>
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-lg font-bold mb-2" htmlFor="country">
              {t("country")}
            </label>
            <select
              className="border-2 border-gray-400 border-solid h-10 w-[450px] mb-2 p-2"
              name="country"
              id="country"
              value={address.country}
              onBlur={handleBlur}
              onChange={handleChange}
            >
              <option value="">{t("select-country")}</option>
              <option value="Brasil">Brasil</option>
              <option value="China">China</option>
              <option value="Espanha">Espanha</option>
              <option value="USA">USA</option>
            </select>
            <p className="text-red-600 text-xs">
              {(touched.country || status === STATUS.SUBMITTED) &&
                errors.country}
            </p>
          </div>
          <div>
            <input
              className="bg-lime-700 text-white p-3 mt-4 rounded-lg font-bold cursor-pointer"
              type="submit"
              value={t("btnSubmit")}
              disabled={status === STATUS.SUBMITTING}
            />
          </div>
        </div>
      </form>
      <div className="flex justify-center gap-2 mt-4">
        <p>
          {t("city")}: <span className="font-bold">{address.city}</span>
        </p>
        <p>
          {t("country")}: <span className="font-bold">{address.country}</span>
        </p>
      </div>
    </>
  );
}
