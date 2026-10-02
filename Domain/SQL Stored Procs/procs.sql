USE BudgetTracker
GO

/****** Object:  UserDefinedFunction [dbo].[fncSplit]    Script Date: 9/28/2026 10:08:09 AM ******/
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

create PROCEDURE [Report].[spGrantBalance]  
(
	@aiYear					SMALLINT = 2025,
	@avcInitiatives			VARCHAR(MAX) = ''
)
AS
BEGIN

	SET NOCOUNT OFF

	DECLARE @budget TABLE (
		initiative_id INT,
		grant_id INT,
		account_id SMALLINT,
		init_budget NUMERIC(12, 4) DEFAULT 0,
		journals NUMERIC(12, 4) DEFAULT 0,
		budget AS (init_budget + journals),
		disbursements NUMERIC(12, 4) DEFAULT 0,
		balance AS ((init_budget + journals) + (disbursements))
	)

	DECLARE @initiatives TABLE (id INT, description VARCHAR(500))
	--DECLARE @grants TABLE (grant_id INT, [description] VARCHAR(200))


	IF LEN(@avcInitiatives) = 0
		INSERT INTO @initiatives
		SELECT g.id, g.name
		FROM tblInitiative g
	ELSE
		INSERT INTO @initiatives
		SELECT g.id, g.name
		FROM tblInitiative g
		WHERE g.id IN (SELECT value FROM dbo.fncSplit(@avcInitiatives, ','))


	
	INSERT INTO @budget (initiative_id, grant_id, account_id, init_budget, journals, disbursements)
	SELECT  initiative_id, grant_id,  account_id, 
		IsNull(Pvt.[B], 0) AS budget, 
		IsNull(Pvt.[R], 0) AS journals, 
		IsNull(Pvt.[D], 0) AS disbursements
	FROM 
	(
		SELECT b.initiative_id, b.grant_id, b.account_id, item_type, amount
		FROM tblBudget b INNER JOIN @initiatives i ON
				b.initiative_id = i.id
			INNER JOIN tblGrant g ON
				b.grant_id = g.id
			WHERE b.year = @aiYear
	) AS b
	PIVOT 
	(
		SUM(amount)
		FOR item_type IN ([B],[R],[D])
	) Pvt






	DECLARE @pending TABLE (
		initiative_id INT,
		grant_id INT,
		account_id INT,
		pending_disb NUMERIC(12, 4))


	
	INSERT INTO @pending (initiative_id, grant_id, account_id, pending_disb)
	SELECT  initiative_id, grant_id,  account_id, SUM(b.amount)
	FROM 
	(
		SELECT g.id grant_id, 
			d.initiative_id,				
			d.amount, 	
			a.id account_id
		FROM tblDisb h INNER JOIN tblGrant g ON
				h.grant_id = g.id
			INNER JOIN tblDisbLineItem d ON
				d.disb_id = h.id
			INNER JOIN @initiatives i ON
				d.initiative_id = i.id				
			INNER JOIN tblCategory acc ON
				acc.id = d.category_id
			INNER JOIN tblAccount a ON
				a.category_id = acc.id					
		WHERE h.posted = 0
	) AS b
	GROUP BY b.account_id, b.initiative_id, b.grant_id



	
		
	SELECT ROW_NUMBER() OVER (ORDER BY init_desc, grant_desc) rowNum,  *
	FROM (
		SELECT 
			g.[year] AS grant_year,
			i.name  AS init_desc,
			g.name AS grant_desc, 
			ac.[name] AS acc_cat_name,
			b.account_id,
			b.init_budget,
			b.journals,
			b.budget,
			b.disbursements,
			b.balance, 
			0 pending_disb, 
			0 total_pending_disb
		FROM @budget b INNER JOIN tblInitiative i ON
				b.initiative_id = i.id
			INNER JOIN tblGrant g ON
				g.id = b.grant_id
			INNER JOIN tblAccount a ON
				a.id = b.account_id
			INNER JOIN tblCategory ac ON
				ac.id = a.category_id
		UNION
		SELECT
			g.[year] AS grant_year,
			 i.name  AS init_desc,
			 g.name AS grant_desc, 
			ac.[name] AS acc_cat_name,
			p.account_id,
			0, 0, 0, 0, 0, 0,
			p.pending_disb
		FROM @pending p INNER JOIN tblInitiative i ON
				p.initiative_id = i.id
			INNER JOIN tblGrant g ON
				g.id = p.grant_id
			INNER JOIN tblAccount a ON
				a.id = p.account_id
			INNER JOIN tblCategory ac ON
				ac.id = a.category_id
	) AS f
	ORDER BY init_desc, grant_desc



END

go

[Report].[spGrantBalance]  


