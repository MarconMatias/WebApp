-- ============================================================
-- 02 - Usuarios y Admins
-- ============================================================

USE glamours;
GO

-- ------------------------------------------------------------
-- Usuarios (clientes de la tienda)
-- ------------------------------------------------------------
CREATE TABLE Usuarios (
    id             INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    nombre         NVARCHAR(100) NOT NULL,
    apellido       NVARCHAR(100) NOT NULL,
    email          NVARCHAR(255) NOT NULL,
    password_hash  NVARCHAR(255) NOT NULL,
    telefono       NVARCHAR(20)  NULL,
    activo         BIT           NOT NULL DEFAULT 1,
    created_at     DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_Usuarios_Email UNIQUE (email)
);
GO

-- ------------------------------------------------------------
-- Admins (panel de administracion del local)
-- ------------------------------------------------------------
CREATE TABLE Admins (
    id             INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    nombre         NVARCHAR(100) NOT NULL,
    apellido       NVARCHAR(100) NOT NULL,
    email          NVARCHAR(255) NOT NULL,
    password_hash  NVARCHAR(255) NOT NULL,
    activo         BIT           NOT NULL DEFAULT 1,
    created_at     DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_Admins_Email UNIQUE (email)
);
GO
