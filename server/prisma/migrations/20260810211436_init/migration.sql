-- CreateTable
CREATE TABLE `categorias_proveedor` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `categorias_proveedor_nombre_key`(`nombre`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id_proveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria_id` INTEGER NOT NULL,
    `nombre_empresa` VARCHAR(150) NOT NULL,
    `cedula_juridica` VARCHAR(30) NULL,
    `telefono` VARCHAR(20) NULL,
    `correo` VARCHAR(150) NULL,
    `direccion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'EN_EVALUACION', 'SUSPENDIDO') NOT NULL DEFAULT 'EN_EVALUACION',
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `proveedores_cedula_juridica_key`(`cedula_juridica`),
    INDEX `proveedores_categoria_id_idx`(`categoria_id`),
    PRIMARY KEY (`id_proveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactos_proveedor` (
    `id_contacto` INTEGER NOT NULL AUTO_INCREMENT,
    `proveedor_id` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `puesto` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `correo` VARCHAR(150) NULL,
    `es_principal` BOOLEAN NOT NULL DEFAULT false,

    INDEX `contactos_proveedor_proveedor_id_idx`(`proveedor_id`),
    PRIMARY KEY (`id_contacto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rol` ENUM('ADMINISTRADOR', 'COMPRAS', 'CONSULTA') NOT NULL DEFAULT 'CONSULTA',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluaciones_proveedor` (
    `id_evaluacion` INTEGER NOT NULL AUTO_INCREMENT,
    `proveedor_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `calificacion` DECIMAL(2, 1) NOT NULL,
    `comentario` VARCHAR(500) NULL,
    `fecha_evaluacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `evaluaciones_proveedor_proveedor_id_idx`(`proveedor_id`),
    INDEX `evaluaciones_proveedor_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id_evaluacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proveedores` ADD CONSTRAINT `proveedores_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_proveedor`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos_proveedor` ADD CONSTRAINT `contactos_proveedor_proveedor_id_fkey` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluaciones_proveedor` ADD CONSTRAINT `evaluaciones_proveedor_proveedor_id_fkey` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluaciones_proveedor` ADD CONSTRAINT `evaluaciones_proveedor_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
