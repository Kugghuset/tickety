/*
Creates the CallBack table
*/

IF (Object_ID('CallBack', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[CallBack] (
      [callBackId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [ticketId] bigint NULL
    , [npsId] bigint NULL
    , [userId] bigint NULL
    , [agentName] varchar(255) NULL -- Doesn't have to be a user
    , [callBackDate] datetime2 NULL
    , [callBackStatus] varchar(255) DEFAULT 'Not called' NULL
    , [reasonToPromote1] varchar(255) NULL
    , [reasonToPromote2] varchar(255) NULL
    , [reasonToDetract1] varchar(255) NULL
    , [reasonToDetract2] varchar(255) NULL
    , [callBackFollowUpAction] varchar(MAX) NULL
    , [callBackComment] varchar(MAX) NULL
    , [postCallBackNpscScore] tinyint NULL
    , [isClosed] bit NULL DEFAULT 0
    , [dateClosed] datetime2 NULL
    , [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'dateCreated'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'dateUpdated'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'agentName'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [agentName] varchar(255) NULL
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'isClosed'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [isClosed] bit NULL DEFAULT 0
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'dateClosed'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [dateClosed] datetime2 NULL
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'npsId'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [npsId] bigint NULL
  END

  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'postCallBackNpscScore'
                AND Object_ID = Object_ID(N'CallBack'))
  BEGIN
    ALTER TABLE [dbo].[CallBack]
    ADD [postCallBackNpscScore] tinyint NULL
  END
