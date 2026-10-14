selecT  * from tblDisb where id = (select max(id) from tblDisb)

selecT  * from tblDisbLineItem where disb_id = (select max(id) from tblDisb)

select * from tblBudget where id > (select max(id) - 10 from tblBudget)