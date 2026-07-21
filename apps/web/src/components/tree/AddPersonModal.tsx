import type { Person } from "@familyroot/shared";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useAddRelative, useCreateFirstPerson } from "../../hooks/useFamily";
import { toast } from "sonner";

interface PayloadType {
  name: string;
  gender: "male" | "female" | "others";
  bio: string | null;
  dob: string;
  dod: string | null;
  picUrl: string | null;

  relativeId: string;
  relationType: "parent" | "child" | "spouse";
}

const AddPersonModal = ({
  selectedPerson,
  familyId,
  isOpen,
  onClose,
  isFirstPerson,
}: {
  selectedPerson?: Person;
  familyId: string;
  isOpen: boolean;
  onClose: () => void;
  isFirstPerson: boolean;
}) => {
  const { mutate: addFirstPerson, isPending: isCreatingFirstPerson } =
    useCreateFirstPerson(familyId);
  const { mutate: addRelative, isPending: isAddingRelative } =
    useAddRelative(familyId);

  const [step, setStep] = useState<"fillDetails" | "selectType">(
    isFirstPerson ? "fillDetails" : "selectType",
  );
  const [isAlive, setIsAlive] = useState(true);

  const [formData, setFormData] = useState<PayloadType>({
    name: "",
    gender: "male",
    bio: null,
    dob: "",
    dod: null,
    picUrl: null,

    relativeId: selectedPerson ? selectedPerson.id : "",
    relationType: "parent",
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const handleMutationError = (err: unknown) => {
      if (isAxiosError(err)) {
        toast.error(err.message);
      } else {
        toast.error("something went wrong");
      }
      console.log(err);
    };

    if (isFirstPerson) {
      addFirstPerson(
        {
          name: formData.name,
          gender: formData.gender,
          bio: formData.bio,
          dob: formData.dob,
          dod: formData.dod,
          picUrl: formData.picUrl,
        },
        {
          onSuccess: () => {
            toast.success("Person added successfully");
            onClose();
          },
          onError: handleMutationError,
        },
      );
    } else {
      addRelative(formData, {
        onSuccess: () => {
          toast.success("Person added successfull ");
          onClose();
        },
        onError: handleMutationError,
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex bg-black/50 items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="font-bold text-red-300 hover:cursor-pointer"
        >
          X
        </button>

        {step === "selectType" ? (
          <div className="flex flex-col gap-2 items-center">
            {selectedPerson && (
              <h2 className="font-bold">
                Add relative to{" "}
                <span className="text-primary">{selectedPerson.name}</span>
              </h2>
            )}

            {isFirstPerson && (
              <h2 className="font-bold">Add person's details</h2>
            )}
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, relationType: "parent" }));
                setStep("fillDetails");
              }}
              className="hover:cursor-pointer font-bold"
            >
              Add Parent
            </button>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, relationType: "child" }));
                setStep("fillDetails");
              }}
              className="hover:cursor-pointer font-bold"
            >
              Add Child
            </button>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, relationType: "spouse" }));
                setStep("fillDetails");
              }}
              className="hover:cursor-pointer font-bold"
            >
              Add Spouse
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="font-bold">Add details</h1>

                <div className="mt-1 flex flex-col w-full gap-1">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="border border-primary  p-2 rounded focus:outline-none"
                    required
                  />
                </div>
                <div className="mt-1 flex flex-col w-full gap-1">
                  <label htmlFor="gender">gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value as "male" | "female" | "others",
                      }))
                    }
                    className="border border-primary  p-2 rounded focus:outline-none"
                    required
                  >
                    <option value="">select gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="others">others</option>
                  </select>
                </div>
                <div className="mt-1 flex flex-col w-full gap-1">
                  <label htmlFor="bio">Bio</label>
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="border border-primary  p-2 rounded focus:outline-none"
                    placeholder="optional"
                  />
                </div>
                <div className="mt-1 flex flex-col w-full gap-1">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    className="border border-primary p-2 rounded focus:outline-none"
                  />
                </div>

                <div className="w-full flex gap-2">
                  <span>Is the person alive ? </span>
                  <span>yes</span>
                  <input
                    type="radio"
                    name="alive"
                    checked={isAlive}
                    onChange={() => {
                      setIsAlive(true);
                      setFormData((prev) => ({ ...prev, dod: "" }));
                    }}
                    value="yes"
                  />
                  <span>no</span>
                  <input
                    type="radio"
                    name="alive"
                    checked={!isAlive}
                    onChange={() => setIsAlive(false)}
                    value="no"
                  />
                </div>
                {!isAlive && (
                  <div className="mt-1 flex flex-col w-full gap-1">
                    <label htmlFor="dod">Date of Death</label>{" "}
                    <input
                      type="date"
                      name="dod"
                      value={formData.dod ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dod: e.target.value,
                        }))
                      }
                      className="border border-primary p-2 rounded focus:outline-none"
                    />
                  </div>
                )}

                <button
                  disabled={isCreatingFirstPerson || isAddingRelative}
                  type="submit"
                  className="mt-2 p-4 w-full text-xs text-primary border border-primary rounded rounded-xl hover:bg-primary-light"
                >
                  Add person
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPersonModal;
