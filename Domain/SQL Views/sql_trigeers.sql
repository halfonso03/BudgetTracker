

CREATE TRIGGER [dbo].[trg_tblBudget_Update]
   ON  [dbo].[tblBudget]
   AFTER UPDATE
AS 
BEGIN


    INSERT INTO [Audit].[tblBudget]
               ([initiative_id]
               ,[grant_id]
               ,[account_id]
               ,[amount]
               ,[item_type]
               ,[year]
               ,[created_by]
               ,[create_date]
               ,[additional_information]
               ,[version])
        SELECT [initiative_id]
               ,[grant_id]
               ,[account_id]
               ,[amount]
               ,[item_type]
               ,[year]
               ,[created_by]
               ,GETDATE()
               ,[additional_information]
               ,'old'
        FROM deleted


  INSERT INTO [Audit].[tblBudget]
               ([initiative_id]
               ,[grant_id]
               ,[account_id]
               ,[amount]
               ,[item_type]
               ,[year]
               ,[created_by]
               ,[create_date]
               ,[additional_information]
               ,[version])
        SELECT [initiative_id]
               ,[grant_id]
               ,[account_id]
               ,[amount]
               ,[item_type]
               ,[year]
               ,[created_by]
               ,GETDATE()
               ,[additional_information]
               ,'new'
        FROM inserted

END

