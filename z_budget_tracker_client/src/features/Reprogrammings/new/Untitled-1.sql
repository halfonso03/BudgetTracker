DECLARE @r int = 100 -- (select max(id) from tblRepro)
select * from tblRepro  where id = @r


SELECT * 
  FROM [BudgetTracker].[dbo].[tblReproLineItem]
  where repro_id = @r

--   select * from tblBudget

--   delete tblBudget

-- delete tblRepro where id < 24

select * from tblAccount where category_id = 1
select * from tblAccount where category_id = 2