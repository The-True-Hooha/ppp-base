"use client";
import Logo from "@/components/Logo";
import React, { useState, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { useRouter } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getWorker } from "@/redux/slices/getWorkerSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  fetchCollectedVouchers,
  fetchVouchers,
} from "@/redux/slices/fetchVouchersSlice";
import { fetchProducts } from "@/redux/slices/fetchProductsSlice";
import { handleDate, handlePageNumber, handlePocName, handleProductName, handleSearch, handleStaffName, handleTake } from "@/redux/slices/variableSlice";

export default function Layout({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { pageNumber, take, search, productName, staffName, pocName, date } =
    useSelector((state) => state.variables);
  const { worker } = useSelector((state) => state.worker);
  const { userInfo } = useSelector((state) => state.auth);
  const personnel = worker?.personnel_poc_data
    ?.map((p) => p.personnelId)
    .flat();

  const personnelId = personnel?.[0];

  // console.log(userInfo);
  useEffect(() => {
    (async () => {
      if (isAuth) {
        try {
          const resProducts = await axios.get(
            `/api/product?take=${take}&pageNumber=${pageNumber}&name`
          );
          // console.log(resProducts);
          dispatch(fetchProducts({ ...resProducts?.data }));
        } catch (e) {
          // console.log(e);
        }
      } else {
        return;
      }
    })();
  }, [dispatch, isAuth, pageNumber, take, productName]);

  useEffect(() => {
    (async () => {
      const { user } = await getUser();

      if (!user || user.user.role !== "PERSONNEL") {
        router.push("/");
        setIsAuth(false);
        return;
      } else {
        // if no error
        dispatch(setCredentials({ ...user.user }));
        setIsAuth(true);
        dispatch(handleDate(""));
        dispatch(handleSearch(""));
        dispatch(handleProductName(""));
        dispatch(handlePocName(""));
        dispatch(handleStaffName(""));
        dispatch(handlePageNumber(1));
        dispatch(handleTake(10));
      }
      // console.log(user);
    })();
  }, [dispatch, router]);

  useEffect(() => {
    (async () => {
      if (isAuth) {
        const resWorker = await axios.get(
          `/api/admin/staff/${userInfo?.id}?email=${userInfo?.email}`
        );
        // console.log(resWorker);
        dispatch(getWorker({ ...resWorker?.data.data }));
      } else {
        return;
      }
    })();
  }, [dispatch, isAuth, userInfo?.email, userInfo?.id]);
  // console.log(isAuth);

  useEffect(() => {
    (async () => {
      if (isAuth) { 
        try {
          const resCollectedVouchers = await axios.get(
            `/api/admin/voucher/personnel?customer=${search}&product_name=${productName}&date=${date}`
            // ?customer=${search}?product_name${productName}?date
          );
          dispatch(fetchCollectedVouchers({ ...resCollectedVouchers?.data }));
          // console.log(resCollectedVouchers);
          // console.log(resPocs)
        } catch (e) {
          // console.log(e);
        }
      } else {
        return;
      }
    })();
  }, [
    dispatch,
    isAuth,
    pageNumber,
    personnelId,
    productName,
    search,
    take,
    date,
  ]);

  if (!isAuth) {
    return (
      <section className="h-screen">
        <div className="flex justify-center items-center h-full">
          <div className="text-primaryActive ">
            <ImSpinner9 size={100} className="animate-spin" />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <div className="">
        <Header />
        <Suspense>
          <main className="pt-12">{children}</main>
        </Suspense>
        <footer>
          <Navbar />
        </footer>
      </div>
    );
  }
}

async function getUser() {
  try {
    const { data } = await axios.get("/api/auth");
    return {
      user: data,
      // error: null,
    };
    // console.log(res);
  } catch (e) {
    return {
      user: null,
      // error,
    };
  }
}
