import { useNavigate } from "react-router";
import { useCreateFamily, useFamilies } from "../hooks/useFamily";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const { data: families, isLoading } = useFamilies();

  const { mutate: createFamily, isPending } = useCreateFamily();
  const navigate = useNavigate();

  const [isOpenFamilyForm, setIsOpenFamilyForm] = useState(false);

  const [familyName, setFamilyName] = useState("");

  const handleCreateFamily = (e: React.SubmitEvent) => {
    e.preventDefault();

    createFamily(
      {
        name: familyName,
      },
      {
        onSuccess: () => {
          toast.success("Family created successfully!");
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            if (error.response?.status === 401) {
              toast.error("Please please log in to continue.");
              return;
            }
            toast.error(
              error.response?.data?.error ?? "Something went wrong !",
            );
          }
        },
      },
    );

    setFamilyName("");

    setIsOpenFamilyForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login");
  };

  return (
    <div className="absolute inset-0">
      <div className="w-full flex ">
        {token ? (
          <button
            onClick={handleLogout}
            className="border border-primary rounded-xl p-2"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-primary rounded-xl p-2"
          >
            Login
          </button>
        )}
      </div>
      <h1>My Families</h1>

      {!token && (
        <div>
          <p>Login to view your family</p>
        </div>
      )}

      {token && isLoading && <p>Loading..</p>}

      {token && !isLoading && families?.length === 0 && (
        <p>You are not associated with any family yet !</p>
      )}

      {token &&
        families?.map((family) => (
          <div
            key={family.familyId}
            onClick={() => navigate(`/family/${family.familyId}`)}
            className="w-full p-4 border border-primary flex flex-col gap-2 items-center "
          >
            <p className="cursor-pointer">{family.family.name}</p>
          </div>
        ))}

      {isOpenFamilyForm && (
        <form
          onSubmit={handleCreateFamily}
          className="w-full/2 relative flex gap-2 mt-2"
        >
          <input
            type="text"
            placeholder="Enter Family Name"
            name="familyName"
            onChange={(e) => setFamilyName(e.target.value)}
            value={familyName}
            className="p-2 border border-primary focus:outline-none rounded"
            required
          />

          <button
            type="submit"
            className="border border-primary p-2 rounded rounded-xl bg-green-200"
            disabled={isPending}
          >
            {isPending ? "creating.." : "Create"}
          </button>
          <button
            className="border border-primary p-2 rounded rounded-xl bg-red-200"
            onClick={() => setIsOpenFamilyForm(false)}
          >
            Cancle
          </button>
        </form>
      )}

      <button
        className={` ${isOpenFamilyForm && "hidden"}   border border-primary mt-4 rounded-xl p-4 font-bold`}
        onClick={() => setIsOpenFamilyForm(true)}
      >
        Create Family
      </button>
    </div>
  );
};

export default Dashboard;
