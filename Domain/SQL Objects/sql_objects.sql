USE [BudgetTracker]
GO
/****** Object:  UserDefinedFunction [dbo].[fncSplit]    Script Date: 11/1/2026 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE FUNCTION [dbo].[fncSplit](@sText varchar(8000), @sDelim varchar(20) = ' ')
RETURNS @retArray TABLE (idx smallint Primary Key, value varchar(8000))
AS
BEGIN
DECLARE @idx smallint,
	@value varchar(8000),
	@bcontinue bit,
	@iStrike smallint,
	@iDelimlength tinyint

IF @sDelim = 'Space'
	BEGIN
	SET @sDelim = ' '
	END

SET @idx = 0
SET @sText = LTrim(RTrim(@sText))
SET @iDelimlength = DATALENGTH(@sDelim)
SET @bcontinue = 1

IF NOT ((@iDelimlength = 0) or (@sDelim = 'Empty'))
	BEGIN
	WHILE @bcontinue = 1
		BEGIN

--If you can find the delimiter in the text, retrieve the first element and
--insert it with its index into the return table.
 
		IF CHARINDEX(@sDelim, @sText)>0
			BEGIN
			SET @value = SUBSTRING(@sText,1, CHARINDEX(@sDelim,@sText)-1)
				BEGIN
				INSERT @retArray (idx, value)
				VALUES (@idx, @value)
				END
			
--Trim the element and its delimiter from the front of the string.
			--Increment the index and loop.
SET @iStrike = DATALENGTH(@value) + @iDelimlength
			SET @idx = @idx + 1
			SET @sText = LTrim(Right(@sText,DATALENGTH(@sText) - @iStrike))
		
			END
		ELSE
			BEGIN
--If you can’t find the delimiter in the text, @sText is the last value in
--@retArray.
 SET @value = @sText
				BEGIN
				INSERT @retArray (idx, value)
				VALUES (@idx, @value)
				END
			--Exit the WHILE loop.
SET @bcontinue = 0
			END
		END
	END
ELSE
	BEGIN
	WHILE @bcontinue=1
		BEGIN
		--If the delimiter is an empty string, check for remaining text
		--instead of a delimiter. Insert the first character into the
		--retArray table. Trim the character from the front of the string.
--Increment the index and loop.
		IF DATALENGTH(@sText)>1
			BEGIN
			SET @value = SUBSTRING(@sText,1,1)
				BEGIN
				INSERT @retArray (idx, value)
				VALUES (@idx, @value)
				END
			SET @idx = @idx+1
			SET @sText = SUBSTRING(@sText,2,DATALENGTH(@sText)-1)
			
			END
		ELSE
			BEGIN
			--One character remains.
			--Insert the character, and exit the WHILE loop.
			INSERT @retArray (idx, value)
			VALUES (@idx, @sText)
			SET @bcontinue = 0	
			END
	END

END

RETURN
END
GO
/****** Object:  View [Audit].[vwBudgets]    Script Date: 11/1/2026 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





CREATE view [Audit].[vwBudgets]
as
select b.version, i.id i_id, g.id g_id, a.id a_id, i.name initiative_name, g.name grant_name, a.name account_name, b.amount, item_type, 
	YEAR(g.start_date) grant_year, b.create_date update_date, u.firstname + ' ' + u.lastname udpated_by

from tblInitiative i join Audit.tblBudget b on i.id = b.initiative_id
join tblAccount a on a.id = b.account_id
join tblGrant g on g.id = b.grant_id
join [Auth].[tblUsers] u on u.id = b.created_by

GO
/****** Object:  View [dbo].[vwBudgets]    Script Date: 11/1/2026 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[vwBudgets]
as
select i.id i_id, g.id g_id, a.id a_id, i.name initiative_name, g.name grant_name, a.name account_name, b.amount, item_type, YEAR(g.start_date) grant_year
from tblInitiative i join tblBudget b on i.id = b.initiative_id
join tblAccount a on a.id = b.account_id
join tblGrant g on g.id = b.grant_id

GO
/****** Object:  View [dbo].[vwPayeeSummary]    Script Date: 11/1/2026 2:00:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[vwPayeeSummary]
AS
WITH max_p (payee_id, last_amount_paid, num_payments) 
AS (
    SELECT p.id payee_id, l.amount last_amount_paid, num_payments
    FROM tblPayee p  
        JOIN tblDisbLineItem l ON p.id = l.payee_id
        JOIN (
            SELECT p.id payee_id, MAX(d.id) max_d_id, COUNT(DISTINCT d.id) num_payments
            FROM tblPayee p
                JOIN tblDisbLineItem l ON p.id = l.payee_id
                JOIN tblDisb d ON d.id = l.disb_id
            WHERE d.posted = 1
            GROUP BY p.id
    ) AS max_p ON
   max_p.payee_id = p.id AND max_p.max_d_id = l.disb_id
)
SELECT v.id, v.name, v.is_active, a.id accountId, c.id categoryId, a.name accountName, v.additional_information, v.payee_type_id,
    CAST(MAX(d.posted_date) AS DATETIME2) lastpaymentdate, 
    max_p.last_amount_paid lastpaymentamount,
    DATEDIFF(d, MAX(d.posted_date), GETDATE()) days_since_last_payment, 
    CAST(SUM(l.amount) AS NUMERIC(15,2)) total_paid,
    CASE v.payee_type_id WHEN 1 THEN 'Vendor' WHEN 2 THEN 'Contractor' END payeeType,
    max_p.num_payments numberofpayments
FROM tblPayee v LEFT OUTER JOIN tblAccount a ON v.account_id = a.id
    LEFT OUTER JOIN tblCategory c ON c.id = a.category_id
    LEFT OUTER JOIN (SELECT l2.amount, l2.disb_id, l2.payee_id FROM tblDisb d2 JOIN tblDisbLineItem l2 ON d2.id = l2.disb_id  WHERE posted  = 1) l ON v.id = l.payee_id
    LEFT OUTER JOIN (SELECT * FROM tblDisb WHERE posted  = 1) d ON d.id = l.disb_id
    LEFT OUTER JOIN max_p ON max_p.payee_id = v.id
GROUP BY v.id, v.name, v.is_active, a.name, a.id, c.id, max_p.last_amount_paid, c.id, v.additional_information, v.payee_type_id,   max_p.num_payments
GO
/****** Object:  StoredProcedure [dbo].[spPayeeSummaries]    Script Date: 11/1/2026 2:00:00 PM ******/


create procedure [dbo].[spPayeeSummaries]
    @searchTerm VARCHAR(100) = 'ADP',
    @year INT = 0 
as
begin 



    WITH last_payment (payee_id, last_id, num_payments)
    AS (
        SELECT l.payee_id, MAX(l.disb_id) last_id, COUNT(DISTINCT l.id) num_payments
        FROM tblDisbLineItem l JOIN tblDisb d ON l.disb_id = d.id
        WHERE d.posted_date IS NOT NULL
        GROUP BY l.payee_id
      ) ,
     last_payment_amount (payee_id, days_since_last_payment, last_payment_amount, last_payment_date, num_payments)
    AS
    (
      SELECT l.payee_id, DATEDIFF(d, l.entry_date, GETDATE()), l.amount, CAST(l.entry_date AS DATE), lp.num_payments
      FROM tblDisbLineItem l JOIN last_payment lp ON l.payee_id = lp.payee_id AND l.disb_id = lp.last_id
        JOIN tblDisb d ON d.id = l.disb_id
       WHERE d.year = CASE WHEN @year !=  0 THEN @year ELSE d.year END
  
    )
    SELECT 
        p.id,
        p.name,
        p.is_active,
        a.category_id categoryid,
        a.id accountid,
        a.name accountName,
        p.additional_information,
         p.payee_type_id,
        CASE p.payee_type_id WHEN 1 THEN 'Vendor' WHEN 2 THEN 'Contractor' END AS payeeType,
        lpa.last_payment_amount lastpaymentamount, 
        lpa.days_since_last_payment, 
        lpa.payee_id, 
        lpa.last_payment_date lastpaymentdate,
        SUM(l.amount) total_paid,
        lpa.num_payments numberofpayments

    FROM tblPayee p LEFT OUTER JOIN last_payment_amount lpa ON p.id = lpa.payee_id 
        LEFT OUTER JOIN tblDisbLineItem l ON l.payee_id = lpa.payee_id
        LEFT OUTER JOIN tblDisb d ON d.id = l.disb_id
        LEFT OUTER JOIN tblAccount a ON p.account_id = a.id
        LEFT OUTER JOIN tblCategory c ON c.id = a.category_id
   
    GROUP BY p.id, p.name, p.is_active, a.category_id, a.id, a.name, p.additional_information, p.payee_type_id, lpa.last_payment_amount, lpa.days_since_last_payment, lpa.payee_id, lpa.last_payment_date,lpa.num_payments 


end

GO




create proCEDURE [Report].[spBudgetDetail]
(
	@aiYear				SMALLINT = 2025,
	@avcGrants			VARCHAR(MAX) = '',
	@aiBudgetCat		INT = 1
)
AS
BEGIN

	SET NOCOUNT ON
	
	
	
	DECLARE @grantid INT 
	
	DECLARE @initiatives TABLE (initiative_id INT, [description] VARCHAR(8000), init_type_id SMALLINT)
	DECLARE @grants TABLE (grant_id INT,description VARCHAR(300))

	IF LEN(@avcGrants) = 0
		INSERT INTO @grants
		SELECT g.id, g.name
		FROM tblGrant g
		WHERE year = @aiYear
	ELSE
		INSERT INTO @grants
		SELECT g.id, g.name
		FROM tblGrant g
		WHERE year = @aiYear AND g.id IN (SELECT value FROM dbo.fncSplit(@avcGrants, ','))
	


	DECLARE @item_types TABLE (item_type CHAR(10))

	IF @aiBudgetCat = 1
		INSERT INTO @item_types VALUES ('B')
	ELSE IF @aiBudgetCat = 2
		INSERT INTO @item_types VALUES ('B'),('R')


			
	SELECT tblBudget.amount amount, 
		tblBudget.item_type, tblInitiative.id, 
		tblInitiative.name AS init_desc, 
		tblAccount.name AS account_name, tblCategory.name AS account_cat_name, 
		tblCategory.id AS category_id, tblBudget.[year], 
			tblGrant.description AS grant_desc, bc.comment_text, 
			tblGrant.grant_id, tblAccount.id AS account_id
	FROM tblBudget INNER JOIN tblInitiative  ON 
			tblBudget.initiative_id = tblInitiative.id 
		INNER JOIN @grants tblGrant ON 
			tblBudget.grant_id = tblGrant.grant_id 
		INNER JOIN tblAccount ON 
			tblBudget.account_id = tblAccount.id 
		INNER JOIN tblCategory ON 
			tblAccount.category_id = tblCategory.id
		LEFT OUTER JOIN tblBudgetComment bc ON
			bc.initiative_id = tblBudget.initiative_id
			AND bc.grant_id = tblBudget.grant_id
			AND bc.account_id = tblBudget.account_id
	WHERE  (tblBudget.[year] = @aiYear)
			AND (tblBudget.item_type) IN 
				(SELECT item_type FROM @item_types)
	ORDER BY item_type
		
END


GO
