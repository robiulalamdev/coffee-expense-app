import useInputPattern from "@/lib/hooks/useInputPattern";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// const CLIENT_URL = "http://localhost:3000";
const CLIENT_URL = "https://coffee-expense.vercel.app";

const HomeMain = () => {
  const { handleNumber } = useInputPattern();
  const [expense, setExpense] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [todayExpense, setTodayExpense] = useState(null);
  const [open, setOpen] = useState("");

  const { handleSubmit, register, setValue, watch, reset } = useForm();

  const getExpenses = async () => {
    try {
      const response = await fetch(`${CLIENT_URL}/api/expense/get-expense`);
      const data = await response.json();
      if (data?.success) {
        setTodayExpense(data?.data?.today);
        setExpense(data?.data?.expense);
        setAllExpenses(data?.data?.all_expenses);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred, check the console.");
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const addExpenses = async (data) => {
    const newData = {
      coffee: parseInt(data?.coffee),
      food: parseInt(data?.food),
      alcohol: parseInt(data?.alcohol),
    };
    try {
      if (todayExpense) {
        fetch(`${CLIENT_URL}/api/expense/update-expense/${todayExpense?.id}`, {
          method: "PATCH",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success) {
              getExpenses();
              reset();
              setOpen("");
              toast.success(data?.message);
            } else {
              toast.error(data?.message);
            }
          });
      } else {
        fetch(`${CLIENT_URL}/api/expense/add-expense`, {
          method: "POST",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success) {
              getExpenses();
              reset();
              setOpen("");
              toast.success(data?.message);
            } else {
              toast.error(data?.message);
            }
          });
      }
    } catch (error) {
      alert("An error occurred, check the console.");
    }
  };

  const removeExpenses = async (id) => {
    try {
      fetch(`${CLIENT_URL}/api/expense/remove-expense/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success) {
            getExpenses();
            toast.success(data?.message);
          } else {
            toast.error(data?.message);
          }
        });
    } catch (error) {
      alert("An error occurred, check the console.");
    }
  };

  const handleBack = () => {
    setOpen("");
  };

  const handleEdit = () => {
    if (todayExpense) {
      setValue("coffee", todayExpense?.coffee);
      setValue("food", todayExpense?.food);
      setValue("alcohol", todayExpense?.alcohol);
    }
    setOpen("update");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 flex flex-col justify-center items-center w-full h-screen">
      <div className="grid md:grid-cols-2 gap-4 w-full h-fit max-h-fit mt-14">
        <div className="border border-blue-600 rounded-md w-full h-full max-h-fit p-3">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-blue-950">
              Am i Spending too much?
            </h1>
            {todayExpense ? (
              <button
                onClick={() => handleEdit()}
                className="bg-blue-600 text-white font-xs rounded-sm w-fit px-2 h-8 flex justify-center items-center"
              >
                <small>Edit Expenses</small>
              </button>
            ) : (
              <button
                onClick={() => setOpen("add")}
                className="bg-blue-600 text-white font-xs rounded-sm w-fit px-2 h-8 flex justify-center items-center"
              >
                <small>Add Expenses</small>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mt-14">
            <div className="flex items-center gap-8">
              <div className="w-[100px]">
                <h1 className="font-semibold text-blue-950">Coffee ☕</h1>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-sm font-semibold text-blue-950">
                  ${expense?.coffee} / Week
                </h1>
                <h1 className="text-xs font-semibold text-red-600">
                  0% above average
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-[100px]">
                <h1 className="font-semibold text-blue-950">Food 🍔</h1>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-sm font-semibold text-blue-950">
                  ${expense?.food} / Week
                </h1>
                <h1 className="text-xs font-semibold text-red-600">
                  0% above average
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-[100px]">
                <h1 className="font-semibold text-blue-950">Alcohol 🍸</h1>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-sm font-semibold text-blue-950">
                  ${expense?.alcohol} / Week
                </h1>
                <h1 className="text-xs font-semibold text-green-600">
                  0% above average
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-blue-600 rounded-md w-full h-full max-h-fit p-3">
          {open && (
            <form onSubmit={handleSubmit(addExpenses)}>
              <h1 className="font-semibold text-blue-950">
                How Much did i Spend today?
              </h1>

              <div className="grid grid-cols-1 gap-4 mt-14">
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Coffee ☕</h1>
                  </div>
                  <input
                    {...register("coffee", { required: true })}
                    type="text"
                    required
                    onInput={handleNumber}
                    className="w-full h-9 outline-none hover:outline-none border border-blue-600 rounded max-w-[100px] bg-gray-50 text-black text-sm px-2"
                  />
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Food 🍔</h1>
                  </div>
                  <input
                    {...register("food", { required: true })}
                    type="text"
                    required
                    onInput={handleNumber}
                    className="w-full h-9 outline-none hover:outline-none border border-blue-600 rounded max-w-[100px] bg-gray-50 text-black text-sm px-2"
                  />
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Alcohol 🍸</h1>
                  </div>
                  <input
                    {...register("alcohol", { required: true })}
                    type="text"
                    required
                    onInput={handleNumber}
                    className="w-full h-9 outline-none hover:outline-none border border-blue-600 rounded max-w-[100px] bg-gray-50 text-black text-sm px-2"
                  />
                </div>

                <h1 className="font-semibold text-xs text-red-600">
                  *** Amount Should be between $1 and $100
                </h1>
              </div>

              <div className="flex items-center gap-4 mt-8">
                {open === "update" && todayExpense && (
                  <button
                    onClick={() => handleBack()}
                    className="bg-white border border-blue-600 text-blue-600 font-xs rounded-sm w-fit px-4 h-8 flex justify-center items-center"
                  >
                    <small>Back</small>
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-xs rounded-sm w-fit px-2 h-8 flex justify-center items-center"
                >
                  {open === "update" && todayExpense ? (
                    <small>Update Expenses</small>
                  ) : (
                    <small>Add Expenses</small>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="w-full h-full mt-8">
        <h1 className="font-bold text-xl mb-2">All Expenses</h1>

        <div className="w-full h-full grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {allExpenses?.map((exp, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 gap-2 bg-gray-100 p-3 rounded border-2 border-blue-600">
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Coffee ☕</h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <h1 className="text-sm font-semibold text-blue-950">
                      ${exp?.coffee} / Week
                    </h1>
                    <h1 className="text-xs font-semibold text-red-600">
                      0% above average
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Food 🍔</h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <h1 className="text-sm font-semibold text-blue-950">
                      ${exp?.food} / Week
                    </h1>
                    <h1 className="text-xs font-semibold text-red-600">
                      0% above average
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-[100px]">
                    <h1 className="font-semibold text-blue-950">Alcohol 🍸</h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <h1 className="text-sm font-semibold text-blue-950">
                      ${exp?.alcohol} / Week
                    </h1>
                    <h1 className="text-xs font-semibold text-green-600">
                      0% above average
                    </h1>
                  </div>
                </div>

                <div className="flex justify-end items-end">
                  <button
                    onClick={() => removeExpenses(exp.id)}
                    className="bg-red-600 text-white font-xs rounded w-fit px-2 h-7 flex justify-center items-center"
                  >
                    <small>Remove</small>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
