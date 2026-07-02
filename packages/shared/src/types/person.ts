export interface Person {

  id: string,
  name: string,
  gender : 'male'| 'female' | 'others',
  bio: string | null,
  picUrl: string | null, 
  dob: string,
  dod: string | null,
  familyId: string

}

export interface Family {
  id:string,
  name: string
}

export interface FamilyMembership {
  familyId: string,
  userId: string,
  role: "admin"|"editor"|"viewer",
  family: Family

}
