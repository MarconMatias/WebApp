-- ============================================================
-- 04 - Envios y Email
-- ============================================================

USE glamours;
GO

-- ------------------------------------------------------------
-- Envios (historial de envios de pedidos)
-- ------------------------------------------------------------
CREATE TABLE Envios (
    id                      INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    pedido_id               INT           NOT NULL,
    estado                  NVARCHAR(20)  NOT NULL DEFAULT 'preparando',
        -- preparando | despachado | en_camino | entregado
    empresa                 NVARCHAR(100) NULL,   -- Andreani, OCA, correo, etc.
    numero_seguimiento      NVARCHAR(100) NULL,
    fecha_despacho          DATETIME2     NULL,
    fecha_entrega_estimada  DATETIME2     NULL,
    fecha_entrega_real      DATETIME2     NULL,
    created_at              DATETIME2     NOT NULL DEFAULT GETDATE(),
    updated_at              DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Envios_Pedidos FOREIGN KEY (pedido_id)
        REFERENCES Pedidos(id),

    CONSTRAINT CK_Envios_Estado CHECK (
        estado IN ('preparando', 'despachado', 'en_camino', 'entregado')
    )
);
GO

-- ------------------------------------------------------------
-- EmailTemplate (plantillas de mails)
-- ------------------------------------------------------------
CREATE TABLE EmailTemplate (
    id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    nombre      NVARCHAR(100) NOT NULL, -- 'confirmacion_compra', 'bienvenida', etc.
    asunto      NVARCHAR(255) NOT NULL,
    cuerpo_html NVARCHAR(MAX) NOT NULL,
    activa      BIT           NOT NULL DEFAULT 1,
    created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
    updated_at  DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_EmailTemplate_Nombre UNIQUE (nombre)
);
GO

-- ------------------------------------------------------------
-- EmailLog (historial unificado: pendientes + enviados)
-- ------------------------------------------------------------
CREATE TABLE EmailLog (
    id                 INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    template_id        INT           NULL,
    usuario_id         INT           NULL,
    destinatario_email NVARCHAR(255) NOT NULL,
    asunto             NVARCHAR(255) NOT NULL,
    estado             NVARCHAR(10)  NOT NULL DEFAULT 'pendiente',
        -- pendiente | enviado | fallido
    intentos           INT           NOT NULL DEFAULT 0,
    error_detalle      NVARCHAR(500) NULL,   -- motivo del fallo si aplica
    fecha_envio        DATETIME2     NULL,   -- cuando fue enviado exitosamente
    created_at         DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_EmailLog_Template FOREIGN KEY (template_id)
        REFERENCES EmailTemplate(id) ON DELETE SET NULL,

    CONSTRAINT FK_EmailLog_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id) ON DELETE SET NULL,

    CONSTRAINT CK_EmailLog_Estado CHECK (
        estado IN ('pendiente', 'enviado', 'fallido')
    )
);
GO
