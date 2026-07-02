import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { FamilyMembership, Person, RelationshipEdge } from "@familyroot/shared";

export const usePersons = (familyId: string) => {
  return useQuery({
    queryKey: ["persons", familyId],
    queryFn: async () => {
      const res = await api.get(`/families/${familyId}/persons`);
      return res.data.data as Person[];
    },
  });
};

export const useRelationships = (familyId: string) => {
  return useQuery({
    queryKey: ["relationship", familyId],
    queryFn: async () => {
      const res = await api.get(`/families/${familyId}/relationships`);
      return res.data.data as RelationshipEdge[];
    },
  });
};


export const useFamilies = ()=> {
  return useQuery({
    queryKey: ['families'],
    queryFn: async ()=> {
      const res = await api.get('/families/mine')
      return res.data.data as FamilyMembership[];

    }

  })

}
