"use client";
import React from "react";
import QuantityCards from "../../components/QuantityCards";
import StatsCard from "../../components/StatsCard";
import { GiGasPump } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoMdTimer } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { PiDropFill } from "react-icons/pi";
import PocList from "../../components/PocList";
import { useSelector } from "react-redux";

export default function Stats() {
  const { worker } = useSelector((state) => state.worker);
  const { collectedVouchers } = useSelector((state) => state.vouchers);
  const personnelPoc = worker?.personnel?.map((p) => p.poc);
  const getAllocation = collectedVouchers?.data
    ?.map((a) => a?.voucher?.product.voucherAllocation)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // console.log(personnelPoc);
  function capitalizeWords(sentence) {
    // Split the sentence into an array of words
    let words = sentence?.split(" ");

    // Iterate over each word
    for (let i = 0; i < words?.length; i++) {
      // Capitalize the first letter of each word
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    // Join the words back into a sentence
    return words?.join(" ");
  }
  //
  const renderPoc = () => {
    if (personnelPoc?.length === 0) {
      return <div>No Point of Consumption Assigned</div>;
    } else {
      return personnelPoc?.map((p, i) => {
        if (p.name) {
          return (
            <PocList
              key={p.id}
              id={p.id}
              name={capitalizeWords(p.name)}
              product={p?.productAllocation}
            />
          );
        } else {
          return <div key={i}>No Point of Consumption Assigned</div>;
        }
      });
    }
  };

  return (
    <section className="pt-4 pb-20 bg-red-40 min-h-screen">
      <div>
        <h4 className="font-medium text-base mt-2 text-center">
          System Statistics
        </h4>
        <div className="flex flex-col flex-wrap gap-3 mt-4">
          <StatsCard
            number={getAllocation ?? 0}
            color="bg-primary"
            title="Total Product Dispensed"
            icon={<PiDropFill size={24} />}
          />
          <StatsCard
            number={collectedVouchers?.data?.length ?? 0}
            color="bg-customGray"
            title="Used Vouchers"
            icon={<MdVerifiedUser size={24} />}
          />
        </div>
      </div>
      <div className="mt-10">
        <h4 className="font-medium text-base mt-2 text-center">
          Product Level at POC
        </h4>
        <div>{renderPoc()}</div>
      </div>
    </section>
  );
}
