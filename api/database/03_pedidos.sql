-- ============================================================
-- 03 - Pedidos y DetallePedido
-- ============================================================

USE glamours;
GO

-- ------------------------------------------------------------
-- Pedidos
-- ------------------------------------------------------------
CREATE TABLE Pedidos (
    id               INT            NOT NULL IDENTITY(1,1) PRIMARY KEY,
    usuario_id       INT            NOT NULL,
    estado           NVARCHAR(20)   NOT NULL DEFAULT 'pendiente',
        -- pendiente | pagado | preparando | enviado | entregado | cancelado
    tipo_entrega     NVARCHAR(10)   NOT NULL DEFAULT 'envio',
        -- envio | retiro
    direccion_envio  NVARCHAR(500)  NULL,       -- NULL si es retiro en local
    total            DECIMAL(10, 2) NOT NULL,
    mp_payment_id    NVARCHAR(100)  NULL,       -- ID de pago de MercadoPago
    notas            NVARCHAR(500)  NULL,
    created_at       DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at       DATETIME2      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Pedidos_Usuarios FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id),

    CONSTRAINT CK_Pedidos_Estado CHECK (
        estado IN ('pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado')
    ),

    CONSTRAINT CK_Pedidos_TipoEntrega CHECK (
        tipo_entrega IN ('envio', 'retiro')
    )
);
GO

-- ------------------------------------------------------------
-- DetallePedido (items dentro de cada pedido)
-- ------------------------------------------------------------
CREATE TABLE DetallePedido (
    id              INT            NOT NULL IDENTITY(1,1) PRIMARY KEY,
    pedido_id       INT            NOT NULL,
    variante_id     INT            NOT NULL,
    cantidad        INT            NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- precio al momento de la compra

    CONSTRAINT FK_DetallePedido_Pedidos FOREIGN KEY (pedido_id)
        REFERENCES Pedidos(id) ON DELETE CASCADE,

    CONSTRAINT FK_DetallePedido_Variantes FOREIGN KEY (variante_id)
        REFERENCES ProductoVariantes(id),

    CONSTRAINT CK_DetallePedido_Cantidad CHECK (cantidad > 0)
);
GO
