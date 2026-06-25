## Thi is the journal off the web-app developement process : Family Root

This is a project that tracks the generations and keeps history of the family.

excuse my english haha

=======

I have completed general setup for type and schema sharing

now begins database understanding and design.

=======

## Database Design and Architecture

This databse will be complex but I will shred it down to strings to understand it.

We are using - psql with prisma orm and prisma client.

on mac :

psql postgres -> starts psql server and enters into psql

\l -> lists all databases available

\c connects to the specific database

\d -> describes the table structure

commands are case insensitive : INSERT, Insert, and insert = same ;

command must be terminated with ;

" " -> is used to reference table names and column names
' ' -> should be used to refer strings while inserting values in table

creating table :

id should be SERIAL PRIMARY KEY - serial mean psql auto increments the number and primary key mean cannot be other than unique
NOT NULL - cannot be null - for eg name field of a person table cannot be null.

# alter table

ALTER TABLE name ADD COLUMN column_name (datatype) REFERENCES table_name ( column_name );

this is how to add a column on an existing table and add foreign key as well

adding foreign key, the datatype of the columns should be same . SERAIL is an Inter

# JOIN tables

eg query :

select students.name, courses.title
from students
join courses on students.course_id = courses.id

this join statement returns a new temporary table with columns sutdents.name and courses.title
and fills the row with
student name from sutdent table and courses's title from courses table and matches them with foreign key course_id

the result is temporary and doesn't alter the real tables.

###### database design and Architecture

I finally decided to go for the simplest yet scalable solution

my database will have only to tables : person and relationship

person table:
holds the entire attributes a person can have : id name gender bio dob dod profile

relationship table holds the two relations : parent and spouse

from these two relations all the other relations cna be derived

relationship table will have attributes : parent_id referenced to id of person table and child_id referenced to the same person table's id column and type .

how does this work ?

1 ram
2 sita
3 hari
4 shyam

relation:

3 1 parent
1 2 spouse
1 4 parent

means 3 hari is aa parent of 1 ram and 1 ram and 2 sita are spouse and 1 ram is a parent of 4 hari

clear !!

moving on --

data type can be created on psql with command

create type typename as enum ( 'opt1', 'opt2' );

I altered few tables : added primary key on relationship table, using constraint added forign key

create table relationship (person_a_id integer, person_b_id integer, type relationship_type, constraint fk_person_a foreign key 
(person_a_id) REFERENCES persons(id), constraint fk_person_b

foreign key (person_b_id) REFERENCES persons(id));

Developed few conventions as well : parent id should always be on the left side and child should be on the right side.

and rows should be created based on the parents mean if ram and sita have 3 children there will be 6 rows for each child two parents.

this makes query easier.

## SQL

I am writing sql here :

how to find ram's children ?

need to use relationship table becuase every relationship is there,

I need to find every row on the person_b_id whose person_a_id is = to rams id ie 1

select person_b_id from relationship where person_a_id = 3 and type = 'parent'; -> this only gives id of the children for names 
need to use Jon statement and get names from perons table ;

now siblings of arjun ( ram's son )

how ?

- first of all need to find his parents
- from his parents we need to find all the children except arjun himself because he is alredy queried.

now

select person_a_id from relationship where person_b_id = 3 ( arjun's id ) and type = 'parent';

- this gives 1 and 2 ( ram and sita - two parents )

now we need to use this returned values / ids to find all the children who shares these parents.

- this needs to be used in subquery :

now I need to find children so query person_b_id

select person_b_id from relationship where person_a_id = ( select person_a_id from relationship where person_b_id = 3 and type = 'parent' ) 
and type = 'parent' and person_b_id != 3;


* explanation : the inner query returns 1 and 2 and we find all the person b whose corresponding person a has id  1 or 2 

but this will not work becuase we have used '  = ' before subquery begins and = doen't know which one to take since it can only resolve one value.
so we use ## IN instead of = 

now the query becomes : 

select person_b_id from relationship where person_a_id in ( select person_a_id from relationship where person_b_id = 3 and type = 'parent' ) 
and type = 'parent' and person_b_id != 3;

this returns : 4 4  although sibling of arjun is only priya with id 4 

4 two times 
it is because, once the query runs from 1 ram and gets 4 and then runs from 2 sita and gets again 4 

to fix this we use ## distinct 

now the query becomes : 
select distinct person_b_id from relationship where person_a_id in ( select person_a_id from relationship where person_b_id = 3 and type = 'parent' ) 
and type = 'parent' and person_b_id != 3;



now it returns only 4 which can be joined to perons table to get the nameof the person. 



now pay attention : 

SELECT DISTINCT p.name FROM persons p JOIN relationship r ON p.id = r.person_b_id WHERE r.person_a_id IN ( SELECT person_a_id FROM relationship WHERE r.person_b_id = 3 
AND TYPE =' parent' ) AND type = 'parent' AND r.person_b_id != 3 ;


This gives the name for the coressponding id which is Priya. 



========================


## Session Notes — DB Design & Prisma Setup

#### SQL Fundamentals

Primary key — unique identifier for every row in a table. Never null, never duplicate. Postgres auto-creates an index on it.
Foreign key — a column that holds another table's primary key value, creating a reference between rows. Postgres enforces that the referenced value must actually exist (referential integrity). Types must match exactly — INTEGER FK must reference an INTEGER PK.
SERIAL — Postgres auto-increment integer type. Creates a hidden sequence that generates 1, 2, 3... automatically. Only the database can generate the next value.
UUID — better choice for distributed apps. Can be generated anywhere (frontend, backend) without a database round trip. Use gen_random_uuid() in Postgres, crypto.randomUUID() in Node.
Why DATE not VARCHAR for dates:

VARCHAR accepts invalid dates silently
DATE enables date math (CURRENT_DATE - dob for age)
DATE indexes and compares correctly
VARCHAR is string comparison, not date comparison

NOT NULL — enforces a column can never be empty. Apply to every column that must always have a value. Don't rely on application code to enforce this — let the database do it.
UNIQUE — enforces no two rows can have the same value. Use on email in User table.
Single quotes vs double quotes in SQL:

'value' — string literal (data)
"column_name" — identifier (table/column name)
Never swap these — Postgres treats them as completely different things

Always terminate SQL statements with ; — without it, psql keeps waiting for more input and swallows everything you type after.

Relational Design
One-to-many — put the foreign key on the "many" side. Example: many students, one course per student → course_id on students table.
Many-to-many — needs a junction/join table. Example: students in multiple courses, courses with multiple students → enrollments(student_id, course_id) table.
Self-referencing table — a foreign key that points back at the same table. Used for parent-child relationships where both sides are the same entity type (Person → Person).
Don't store derived data. If a value can be correctly calculated from existing data, don't store it separately — it will drift and become inconsistent. Examples:

isAlive derived from dod being null
siblingOf derived from sharing a parent
familyId on Relationship derived from the persons involved

Composite primary key — primary key made of multiple columns combined. Used when no single column uniquely identifies a row but a combination does. Example: (person_a_id, person_b_id, type) on Relationship.
ON DELETE RESTRICT — blocks deletion of a row if other rows reference it. Correct choice for family tree — don't silently cascade-delete a person's entire relationship history.
INNER JOIN — combines rows from two tables where the join condition matches on both sides. Rows with no match are dropped entirely. NULL foreign keys never appear in an INNER JOIN result.
LEFT JOIN — keeps all rows from the left table even if no match exists on the right. Use when you want "all X, with Y if it exists."
DISTINCT — removes duplicate rows from results. Necessary when multiple paths through a graph lead to the same person (e.g. finding siblings when a person has two parents both pointing at the same sibling).
Subqueries — a query nested inside another query. Use IN when the subquery returns multiple rows, = only when it returns exactly one row.

Schema Design — FamilyRoot
Five tables, why each exists:
User — platform account. Authentication only. Completely separate from Person nodes in the tree.
Family — the tree container. Has a name, owned indirectly through FamilyMember.
FamilyMember — bridge between User and Family. Carries the role/permission. Composite PK on (userId, familyId). This is where authorization lives, not on Person.
Persons — a node in the family tree. Biographical data only. Has familyId FK. Independent of who is a platform user.
Relationship — edges between person nodes. Only two primitives: parent and spouse. All other relationships (sibling, grandparent, uncle, cousin) are derived at query time by traversing these two.
Why User and Person are separate concepts: a deceased ancestor is a Person node but can never be a User. A family historian might be a User managing a tree without being a Person in it. Conflating them forces every tree node to have an account — absurd.
Why FamilyMember exists separately from Persons: Persons answers "who exists in this tree as a node." FamilyMember answers "which platform users have access to this tree and what can they do." Different questions, different tables.
RBAC — Role Based Access Control: admin owns and manages the tree. editor can add/edit persons and relationships. viewer can only read. Check membership + role on every API request before returning data.
Authorization check pattern:
sqlSELECT role FROM "FamilyMember" 
WHERE "userId" = <from JWT> AND "familyId" = <from request>;
No row = 403 Forbidden. Row exists = check role against required permission.

Prisma 7 Specifics
prisma.config.ts — configures the Prisma CLI (migrate, generate, studio). Reads DATABASE_URL here.
schema.prisma — defines models and enums only. No url in datasource in Prisma 7 — that moved to prisma.config.ts.
PrismaClient in Prisma 7 — requires a driver adapter:
ts



import { PrismaClient } from './generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
export default prisma;


Single prisma instance — never instantiate PrismaClient multiple times. One db.ts file, import it everywhere.
dotenv/config must be the first import in your entry point — before anything that reads process.env, including your db.ts import.
prisma migrate dev — four things in sequence:

Compares schema against current database state
Generates a .sql migration file in prisma/migrations/
Runs that SQL against the database
Regenerates the Prisma Client

Migration files are permanent — commit them to git. They're a full history of every schema change. Never delete them.
prisma migrate reset — drops everything and replays all migrations from scratch. Development only. All data is lost.
npx prisma validate — checks schema for errors without touching the database. Run this before every migrate.
Prisma back-relations — every relation must be declared on both sides. The side without a FK column uses ModelName[] for one-to-many. Named relations (@relation("PersonA")) required when a model has multiple relations to the same target.
@default(now()) — auto-sets timestamp on insert. Use on every createdAt field.
DateTime? @db.Date — maps to Postgres DATE type (date only, no time). Use for dob and dod.

General Principles Reinforced

No error ≠ correct. Read the actual output.
Fix one thing at a time. Changing multiple things at once makes it impossible to know what fixed what.
Don't store derived data — one source of truth.
Use the most specific type the database offers — DATE not VARCHAR, UUID not TEXT for ids, enum not VARCHAR for fixed value sets.
The database enforces structure and types. Business logic (parent must be older than child) is your application's responsibility.
Paste verbatim output, not summaries. Tools tell you exactly what's wrong — read them.





## Upto now :

Init pnpm monorepo ✓
Set up Vite + React + TS + Tailwind in web ✓
Set up Express + TS in api ✓
Design and migrate Prisma schema ✓
Design tokens (still pending)
