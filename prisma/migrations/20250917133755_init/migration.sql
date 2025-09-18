-- CreateTable
CREATE TABLE "Item"
(
    "id"          INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"        TEXT     NOT NULL,
    "description" TEXT,
    "status"      TEXT     NOT NULL DEFAULT 'ACTIVE',
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   DATETIME NOT NULL
);
