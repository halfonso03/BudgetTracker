
declare @disbIds table (id int)

begin tran

;with ids_row_num (id, next_id)
as (
select id, (select min(id) from tblDisb d2 where d2.id > d1.id and d2. posted = 1) next_id
from tblDisb d1
where posted = 1
),
ids_months (id, mnth)
as
(
select id, case  when id < 75 then 1 when id < 80 then 2  when id < 85 then 3 when id < 90 then 4 when id < 95 
then 5 when id < 100 then 6 when id < 105 then 7 when id < 110 then 8 when id < 115 then 9 when id < 120 then 10 else 11 end
from ids_row_num
),
posted_dates (id, posted_date)
as
(
select id, cast(cast(mnth as varchar(2)) + '/1/2026' as datetime)
from ids_months
)
update tblDisb
set posted_date = p.posted_date
	from tblDisb d join posted_dates p ON d.id = p.id


	select * from tblDisb
	commit
