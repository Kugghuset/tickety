/*
Finds all users matching the @id (which should be only one).
*/

SELECT
  [U].[userId],
  [U].[email],
  [U].[name],
  [U].[password],
  [D].[departmentId] AS [department.departmentId],
  [D].[departmentName] AS [department.departmentName],
  [D].[country] AS [department.country]
  
FROM [dbo].[User] AS [U]

-- Join on departmentId
LEFT JOIN [dbo].[Department] AS [D]
ON [U].[departmentId] = [D].[departmentId]

WHERE [U].[userId] = @userId