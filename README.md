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

