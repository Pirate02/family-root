import type { Person } from "@familyroot/shared";
import { useState } from "react";
import api from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

const AddPersonModal = ({
  selectedPerson,
  familyId,
  isOpen,
  onClose,
}: {
  selectedPerson: Person;
  familyId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState("selectType");

  const [personForm, setPersonForm] = useState({
    name: "",
    gender: "",
    bio: "",
    dob: "",
    dod: "",
    picUrl: "",
  });

  const [relationType, setRelationType] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(
        `/families/${selectedPerson.familyId}/persons`,
        personForm,
      );

      console.log(res);

      const newPerson = res.data.data;

      const relation = await api.post(
        `/families/${selectedPerson.familyId}/relationships`,
        {
          personAId:
            relationType === "child" ? selectedPerson.id : newPerson.id,
          personBId:
            relationType === "child" ? newPerson.id : selectedPerson.id,
          type: relationType === "spouse" ? "spouse" : "parent",
        },
      );

      queryClient.invalidateQueries({ queryKey: ["persons", familyId] });
      queryClient.invalidateQueries({ queryKey: ["relationships", familyId] });
      onClose();
      console.log(relation);
    } catch (err) {
      console.log(err)

    }
  };

  if(!isOpen) return null; 
  return (
    <div>
      <div>
        <button onClick={onClose}>X</button>

        {step === "selectType" ? (
          <div>
            <h2>Add relative to {selectedPerson.name}</h2>
            <button
              onClick={() => {
                setRelationType("parent");
                setStep("fillDetails");
              }}
            >
              Add Parent
            </button>
            <button
              onClick={() => {
                setRelationType("child");
                setStep("fillDetails");
              }}
            >
              Add Child
            </button>
            <button
              onClick={() => {
                setRelationType("spouse");
                setStep("fillDetails");
              }}
            >
              Add Spouse
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={personForm.name}
                  onChange={(e) =>
                    setPersonForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <select
                  name="gender"
                  value={personForm.gender}
                  onChange={(e) =>
                    setPersonForm((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="others">others</option>
                </select>
                <input
                  type="text"
                  name="bio"
                  value={personForm.bio}
                  onChange={(e) =>
                    setPersonForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                />
                <input
                  type="date"
                  name="dob"
                  value={personForm.dob}
                  onChange={(e) =>
                    setPersonForm((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
                <input
                  type="date"
                  name="dod"
                  value={personForm.dod}
                  onChange={(e) =>
                    setPersonForm((prev) => ({ ...prev, dod: e.target.value }))
                  }
                />
                <input
                  type="text"
                  name="picUrl"
                  value={personForm.picUrl}
                  onChange={(e) =>
                    setPersonForm((prev) => ({
                      ...prev,
                      picUrl: e.target.value,
                    }))
                  }
                />

                <button type="submit">Add person</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPersonModal;
