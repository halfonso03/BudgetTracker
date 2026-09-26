

CREATE proCEDURE [Report].[spBudgetDetail]
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

	DECLARE @item_types TABLE (item_type CHAR(10))

	IF @aiBudgetCat = 1
		INSERT INTO @item_types VALUES ('B')
	ELSE IF @aiBudgetCat = 2
		INSERT INTO @item_types VALUES ('B'),('R')

	INSERT INTO @grants
	SELECT g.id,  g.name
	FROM tblGrant g 
	WHERE YEAR(g.start_date) = @aiYear

			
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

go