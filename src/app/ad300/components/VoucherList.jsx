"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function VoucherList({ id, name, index, approved, term, note }) {
  const router = useRouter();

  const gotoVoucher = () => {
    router.push(`/ad300/vouchers/${id}`);
  };

  // console.log(note, name);
  const approveVoucherManually = async () => {
    try {
      const res = await axios.patch(`/api/admin/voucher/verify/${id}`);
      if (res) {
        // console.log(res);
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white  active:text-hite hover:bg-primaryActive rounded-xl py-3 h-16 text-base px-3 items-center justify-between duration-200 ">
      <div
        onClick={gotoVoucher}
        className=" w-full h-full flex  cursor-pointer flex-col"
      >
        <div className="text-lg">{name}</div>
        <div className="text-xs font-semibold">{note}</div>
      </div>
      {index === 0 && !approved && !term && (
        <button onClick={approveVoucherManually} className="btn bg-primary">
          Approve
        </button>
      )}
    </li>
  );
}
