"use client";
import GoBack from "@/components/GoBack";
import React, { useState, useEffect, Suspense } from "react";
import { useFormik } from "formik";
import Loader from "@/components/Loader.jsx";
import { toast } from "react-toastify";
import { new_customer_validate } from "../../../../../../../../lib/validate";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { getCustomer } from "@/redux/slices/getCustomerSlice";
import axios from "axios";
import Loading from "@/components/Loading";
import Image from "next/image";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required("Please select an image")
    .test(
      "fileSize",
      "Must be less than 3mb",
      (value) => value && value.size < 3072 * 3072
    )
    .test(
      "fileType",
      "Invalid file type",
      (value) => value && ["image/jpeg", "image/jpg"].includes(value.type)
    ),
});

export default function Page() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { customer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);

  // console.log(customer);
  // console.log(isFormValid);

  useEffect(() => {
    const getCustomerDetails = async () => {
      const res = await axios.get(`/api/customer/${id}`);

      dispatch(getCustomer({ ...res.data.data }));
    };

    getCustomerDetails();
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      fullName: customer?.name,
      email: customer?.email,
      phone: customer?.phoneNumber,
      address: customer?.address,
      image: customer?.image,
    },
    validate: new_customer_validate,
    // validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    // Update form values when constraintData changes
    if (customer?.name) {
      formik.setValues({
        fullName: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phoneNumber || "",
        address: customer?.address || "",
        // image: customer?.image || "",
      });
    }
    setPreviewImage(customer?.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const handleRemovePreview = () => {
    setPreviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFieldValue("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };
  const { errors, touched, isSubmitting, setFieldValue } = formik;

  useEffect(() => {
    setIsFormValid(formik.isValid);
  }, [formik.values, formik.errors, formik.isValid]);

  async function handleSubmit(values) {
    const { fullName, email, phone, image, address } = values;
    setIsLoading(true);
    // Create FormData object
    const formData = new FormData();

    // Append all form data fields
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (image) {
      formData.append("profilePicture", image);
    }

    try {
      const res = await axios.patch(`/api/customer/${id}`, formData);
      // console.log(res);
      if (res) {
        setIsLoading(true);
        toast.success(res.message);
        router.back();
      }
      // console.log(values);
    } catch (e) {
      // toast.error(e.data.message);
      console.log(e);
    }
  }
  // console.log(formik?.values?.image);

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
      </div>
      <h3 className="text-center text-lg font-medium mt-3">Customer Details</h3>

      <div className="mt-8">
        {!customer?.name ? (
          <Loading />
        ) : (
          <form onSubmit={formik.handleSubmit} className="mb-4">
            <div className=" h-32 w-40 mx-auto mb-5 relative overflow-hidden ">
              <label
                className={`${
                  previewImage ? "opacity-25" : ""
                } border border-gray-400 border-dashed   h-full w-full  absolute inline-block rounded-lg`}
                htmlFor="image"
              >
                <div>
                  <span className="bg-gray-400  text-xs m-1 px-2 py-1 rounded-lg block w-fit">
                    Choose File
                  </span>
                  <div className="flex flex-col w-full mt-8 items-center text-upload px-2 py-1 rounded-lg ">
                    {/* <AiOutlineCloudUpload size={20} fill="#7164C0" /> */}
                    <span className="text-xs">Upload image</span>
                  </div>
                </div>
              </label>
              <input
                className="mx-2 hidden"
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
              />

              <div className="h-full  top-0 right-0 left-0 bottom-0 bg-white">
                {previewImage && (
                  <Image
                    src={previewImage || formik?.values?.image}
                    alt="Preview"
                    className="h-full w-full object-center object-cover rounded-md"
                    width={500}
                    height={500}
                    priority
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                // disabled={!isEditable}
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                className={getInputClassNames("fullName")}
                {...formik.getFieldProps("fullName")}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-error text-sm">
                  {formik.errors.fullName}
                </div>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-2" htmlFor="email">
                Email
              </label>
              <input
                // disabled={!isEditable}
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
                id="address"
                name="address"
                type="text"
                placeholder="Enter Address"
                className={getInputClassNames("address")}
                {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-error text-sm">
                  {formik.errors.address}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`btn w-full h-11 mt-6 flex justify-center items-center text-lg text-white font-medium duration-200 rounded-xl  ${
                isFormValid
                  ? `${isLoading ? "bg-customGray" : "bg-primary"}`
                  : "bg-customGray cursor-not-allowed"
              } `}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <Loader /> : "Save"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
