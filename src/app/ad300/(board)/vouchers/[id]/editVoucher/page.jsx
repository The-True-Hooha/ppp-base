"use client";
import GoBack from "@/components/GoBack";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Loader from "@/components/Loader.jsx";
import { toast } from "react-toastify";
import { new_voucher_validate } from "../../../../../../../lib/validate";

export default function Page() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => {
    setIsEditable(!isEditable);
  };

  // console.log(isEditable);

  const formik = useFormik({
    initialValues: {
      fullName: "James McClurckin",
      email: "james@gmail.com",
      phone: "09020301822",
      address: "No. 3 sjajbckja aocjb akjbasiisjbsjc ",
      product: "Fuel",
      third_party: true,
      // preferred_poc: "Total Fueling Station",
    },
    validate: new_voucher_validate,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    setIsFormValid(formik.isValid);
  }, [formik.values, formik.errors, formik.isValid]);
  async function handleSubmit(values) {
    // const { email, password } = values;
    // console.log(values);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditable(false);
      toast.success("Successful");
    }, 2000);
  }

  const getInputClassNames = (fieldName) =>
    `${
      formik.errors[fieldName] && formik.touched[fieldName]
        ? "border-error text-error"
        : ""
    }`;

  return (
    <section className="pt-8 pb-20 min-h-screen bg-ed-500">
      <div className="flex justify-between items-center">
        <GoBack />
        {/* <button
          onClick={handleEdit}
          className={`btn ${!isEditable ? "bg-primary" : "bg-customGray"}`}
        >
          {isEditable ? "Cancel" : "Edit"}
        </button> */}
      </div>
      <h3 className="text-center text-lg font-medium mt-3">Edit Voucher Details</h3>

      <div className="mt-8">
        <form onSubmit={formik.handleSubmit} className="mb-4">
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              // disabled={!isEditable}
              readOnly
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              className={getInputClassNames("fullName")}
              {...formik.getFieldProps("fullName")}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-error text-sm">{formik.errors.fullName}</div>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              // disabled={!isEditable}
              readOnly
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              className={getInputClassNames("email")}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-error text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              // disabled={!isEditable}
              readOnly
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              className={getInputClassNames("phone")}
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-error text-sm">{formik.errors.phone}</div>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="address">
              Address
            </label>
            <input
              // disabled={!isEditable}
              readOnly
              id="address"
              name="address"
              type="text"
              placeholder="Enter Address"
              className={getInputClassNames("address")}
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="text-error text-sm">{formik.errors.address}</div>
            )}
          </div>
          <div className="flex flex-col  mb-6">
            <label className="text-sm mb-2" htmlFor="product">
              Select Product
            </label>
            <select
              // disabled={!isEditable}
              id="product"
              name="product"
              placeholder="Select Product"
              className={getInputClassNames("product")}
              {...formik.getFieldProps("product")}
            >
              <option>{formik.values.product}</option>
              <option value="fuel">Fuel</option>
              <option value="diesel">Diesel</option>
              {/* {renderJobCategories()} */}
            </select>
            {formik.touched.product && formik.errors.product && (
              <div className="text-error text-sm">{formik.errors.product}</div>
            )}
          </div>
          <div className="flex items-center mt-6 ">
            <div>
              <input
                name="third_party"
                id="checkbox"
                // disabled={!isEditable}
                type="checkbox"
                className={`h-[14px] w-[14px] rounded-md ${getInputClassNames(
                  "third_party"
                )}`}
                checked={formik.values.third_party}
                onChange={formik.handleChange}
              />
            </div>
            <div className="text-sm ml-2">
              <label htmlFor="checkbox">Allow Third Party</label>
            </div>
          </div>

          <button
            type="submit"
            className={`btn w-full h-11 mt-6 flex justify-center items-center text-lg text-white font-medium duration-200 rounded-xl  ${
              isFormValid
                ? `${isLoading ? "bg-customGray" : "bg-primary"}`
                : "bg-customGray cursor-not-allowed"
            } `}
            // disabled={!isFormValid || isLoading}
          >
            {isLoading ? <Loader /> : "Save"}
          </button>
        </form>
      </div>
    </section>
  );
}
