"use client";
import GoBack from "@/components/GoBack";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Loader from "@/components/Loader.jsx";
import { toast } from "react-toastify";
import { poc_validate } from "../../../../../../../lib/validate";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { FaUser } from "react-icons/fa6";

export default function Page() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [term, setTerm] = useState("");
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [isEditable, setIsEditable] = useState(false);

  const handleAssignModal = () => {
    setShowAssignModal(!showAssignModal);
    //   dispatch(handleSearch(""));
  };
  const handleChange = (e) => {
    setTerm(e.target.value);
    //  if (e.target.value.length >= 3 || e.target.value.length === 0) {
    //    dispatch(handleSearch(e.target.value.toLowerCase()));
    //  }
  };

  return (
    <section className="pt-8 pb-20 min-h-screen bg-ed-500 relative">
      <div className="flex justify-between items-center">
        <GoBack />
      </div>
      <div className="mt-6">
        <h3 className="text-center text-lg font-medium mt-3">
          Assign Personnel
        </h3>
        <div>
          <div className="flex justify-end">
            <button
              onClick={handleAssignModal}
              className="btn bg-primary my-5 place-self-end"
            >
              Assign Personnel
            </button>
          </div>
          <div>
            <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
              <div>James Goodman</div>
              <div>
                <button
                  onClick={handleAssignModal}
                  className="btn bg-error place-self-end"
                >
                  UnAssign
                </button>
              </div>
            </li>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-center text-lg font-medium mt-3">
          Assign Management
        </h3>
        <div className="flex justify-end">
          <button
            onClick={handleAssignModal}
            className="btn bg-primary my-5 place-self-end"
          >
            Assign Management
          </button>
        </div>
        <div>
          <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
            <div>Max Taylor</div>
            <div>
              <button
                onClick={handleAssignModal}
                className="btn bg-error place-self-end"
              >
                UnAssign
              </button>
            </div>
          </li>
          <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
            <div>James Goodman</div>
            <div>
              <button
                onClick={handleAssignModal}
                className="btn bg-error place-self-end"
              >
                UnAssign
              </button>
            </div>
          </li>
        </div>
      </div>

      {/* Modal */}
      {showAssignModal && (
        <div className="bg-[#5C5F6290] backdrop-blur-sm  px-4 min-h-screen absolute top-0 left-0 right-0 bottom-0 z-50">
          <div className="bg-white min-w-[270px] w-full mt-10 mx-auto rounded-xl px-4 pt-4 pb-8">
            <div className="text-end text-primary  flex justify-end ">
              <button>
                <MdOutlineCancel size={24} onClick={handleAssignModal} />
              </button>
            </div>
            <form
              action=""
              onSubmit={(e) => e.preventDefault()}
              className="mt-4"
            >
              <div className="relative ">
                <input
                  type="text"
                  placeholder="Search by customer name"
                  className="w-full  p-2 outline-none rounded-xl   text-base  placeholder:text-sm placeholder:font-normal "
                  value={term}
                  onChange={handleChange}
                />
                <div className="absolute top-3 right-2.5 text-gray-400">
                  <BiSearchAlt2 size={20} />
                </div>
              </div>
            </form>

            {/* {term !== "" && ( */}
            <div className="mt-5 overflow-auto max-h-[70vh] ">
              <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
                <div>Alex Johnson</div>
                <div>
                  <FaUser size={24} className={``} />
                </div>
              </li>
              <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
                <div>Max Taylor</div>
                <div>
                  <FaUser size={24} className={``} />
                </div>
              </li>
              <li className="flex mb-4 border border-gray-200 bg-red-30 hover:text-white hover:bg-primaryActive active:border-primaryActive rounded-xl py-3 text-base px-3 items-center justify-between duration-200 cursor-pointer">
                <div>Dwayne Michael</div>
                <div>
                  <FaUser size={24} className={``} />
                </div>
              </li>
            </div>
            {/* )} */}
          </div>
        </div>
      )}
    </section>
  );
}