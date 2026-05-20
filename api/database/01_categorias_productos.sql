-- ============================================================
-- 01 - Categorias y Productos
-- ============================================================

USE glamours;
GO

-- ------------------------------------------------------------
-- Categorias
-- ------------------------------------------------------------
CREATE TABLE Categorias (
    id         INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    nombre     NVARCHAR(100) NOT NULL,
    activa     BIT           NOT NULL DEFAULT 1,
    created_at DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ------------------------------------------------------------
-- Productos
-- ------------------------------------------------------------
CREATE TABLE Productos (
    id            INT             NOT NULL IDENTITY(1,1) PRIMARY KEY,
    categoria_id  INT             NOT NULL,
    nombre        NVARCHAR(200)   NOT NULL,
    descripcion   NVARCHAR(MAX)   NULL,
    precio        DECIMAL(10, 2)  NOT NULL,
    activo        BIT             NOT NULL DEFAULT 1,
    created_at    DATETIME2       NOT NULL DEFAULT GETDATE(),
    updated_at    DATETIME2       NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Productos_Categorias FOREIGN KEY (categoria_id)
        REFERENCES Categorias(id)
);
GO

-- ------------------------------------------------------------
-- Imagenes de productos (un producto puede tener varias fotos)
-- ------------------------------------------------------------
CREATE TABLE ProductoImagenes (
    id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    producto_id INT           NOT NULL,
    url         NVARCHAR(500) NOT NULL,
    es_principal BIT          NOT NULL DEFAULT 0,
    orden       INT           NOT NULL DEFAULT 0,

    CONSTRAINT FK_ProductoImagenes_Productos FOREIGN KEY (producto_id)
        REFERENCES Productos(id) ON DELETE CASCADE
);
GO

-- ------------------------------------------------------------
-- Variantes de producto (talle + color + disponibilidad)
-- ------------------------------------------------------------
CREATE TABLE ProductoVariantes (
    id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    producto_id INT           NOT NULL,
    talle       NVARCHAR(10)  NOT NULL,   -- XS, S, M, L, XL, XXL, etc.
    color       NVARCHAR(50)  NULL,
    disponible  BIT           NOT NULL DEFAULT 1,
    created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_ProductoVariantes_Productos FOREIGN KEY (producto_id)
        REFERENCES Productos(id) ON DELETE CASCADE,

    CONSTRAINT UQ_Variante UNIQUE (producto_id, talle, color)
);
GO
