USE [BudgetTracker]
GO

/****** Object:  Trigger [dbo].[trg_tblBudget_Update]    Script Date: 10/16/2026 10:58:29 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



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

GO

ALTER TABLE [dbo].[tblBudget] ENABLE TRIGGER [trg_tblBudget_Update]
GO

