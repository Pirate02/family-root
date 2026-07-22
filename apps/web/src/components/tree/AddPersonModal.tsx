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

  const isPending = isCreatingFirstPerson || isAddingRelative;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const handleMutationError = (err: unknown) => {
      if (isAxiosError(err)) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
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
            toast.success("Person added");
            onClose();
          },
          onError: handleMutationError,
        },
      );
    } else {
      addRelative(formData, {
        onSuccess: () => {
          toast.success("Person added");
          onClose();
        },
        onError: handleMutationError,
      });
    }
  };

  if (!isOpen) return null;

  const relationOptions: { type: "parent" | "child" | "spouse"; label: string; hint: string }[] = [
    { type: "parent", label: "Parent", hint: "Add someone above" },
    { type: "child", label: "Child", hint: "Add someone below" },
    { type: "spouse", label: "Spouse", hint: "Add a partner" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/40 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-primary-light bg-white shadow-xl shadow-primary-dark/10">
        {/* Header strip */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-primary-light bg-primary-light/50 px-6 py-4">
          <div>
            <p className="font-serif text-lg text-primary-dark">
              {isFirstPerson
                ? "Add your first person"
                : step === "selectType"
                ? "Add a relative"
                : `Add ${formData.relationType}`}
            </p>
            {selectedPerson && step !== "selectType" && !isFirstPerson && (
              <p className="text-xs text-primary-dark/60">
                Connected to <span className="font-medium text-primary">{selectedPerson.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-primary-dark/50 transition-colors hover:bg-primary-light hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Step indicator — only meaningful when there's an actual two-step choice */}
        {!isFirstPerson && (
          <div className="flex items-center gap-2 px-6 pt-4">
            <div className={`h-1 flex-1 rounded-full ${step === "selectType" ? "bg-primary" : "bg-primary/40"}`} />
            <div className={`h-1 flex-1 rounded-full ${step === "fillDetails" ? "bg-primary" : "bg-primary-light"}`} />
          </div>
        )}

        <div className="px-6 py-6">
          {step === "selectType" ? (
            <div className="flex flex-col gap-2.5">
              {selectedPerson && (
                <p className="mb-1 text-sm text-primary-dark/70">
                  How is this person related to{" "}
                  <span className="font-medium text-primary">{selectedPerson.name}</span>?
                </p>
              )}
              {relationOptions.map(({ type, label, hint }) => (
                <button
                  key={type}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, relationType: type }));
                    setStep("fillDetails");
                  }}
                  className="group flex items-center justify-between rounded-xl border border-primary-light px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span>
                    <span className="block font-medium text-primary-dark">{label}</span>
                    <span className="block text-xs text-primary-dark/50">{hint}</span>
                  </span>
                  <svg
                    className="text-primary-dark/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Amara Okafor"
                  className="rounded-lg border border-primary-light bg-white px-3 py-2 text-sm text-primary-dark placeholder:text-primary-dark/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="gender" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value as "male" | "female" | "others" }))
                  }
                  className="rounded-lg border border-primary-light bg-white px-3 py-2 text-sm text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
                  Bio <span className="normal-case text-primary-dark/35">(optional)</span>
                </label>
                <input
                  id="bio"
                  type="text"
                  name="bio"
                  value={formData.bio ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="A line about who they were"
                  className="rounded-lg border border-primary-light bg-white px-3 py-2 text-sm text-primary-dark placeholder:text-primary-dark/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="dob" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
                    Born
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                    className="rounded-lg border border-primary-light bg-white px-3 py-2 text-sm text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {!isAlive && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="dod" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
                      Died
                    </label>
                    <input
                      id="dod"
                      type="date"
                      name="dod"
                      value={formData.dod ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dod: e.target.value }))}
                      className="rounded-lg border border-primary-light bg-white px-3 py-2 text-sm text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-primary-light/40 px-3 py-2.5">
                <span className="text-sm text-primary-dark/70">Living?</span>
                <div className="ml-auto flex gap-1 rounded-full bg-white p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAlive(true);
                      setFormData((prev) => ({ ...prev, dod: null }));
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      isAlive ? "bg-primary text-white" : "text-primary-dark/50 hover:text-primary-dark"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAlive(false)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      !isAlive ? "bg-primary text-white" : "text-primary-dark/50 hover:text-primary-dark"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <button
                disabled={isPending}
                type="submit"
                className="mt-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Adding…" : "Add person"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;
