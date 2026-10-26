

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



create TRIGGER [dbo].[trg_tblBudget_Insert]
   ON  [dbo].[tblBudget]
   AFTER INSERT
AS 
BEGIN

   IF (SELECT TOP (1) item_type FROM inserted ) != 'B' return


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
               ,'initial_value'
        FROM inserted

END

GO
ALTER TABLE [dbo].[tblBudget] ENABLE TRIGGER [trg_tblBudget_Insert]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



create TRIGGER [dbo].[trg_tblBudget_Update]
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
               ,'OLD_VALUE'
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
               ,'NEW_VALUE'
        FROM inserted

END

GO
ALTER TABLE [dbo].[tblBudget] ENABLE TRIGGER [trg_tblBudget_Insert]
GO
