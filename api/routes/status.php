<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::json(405, false, "Método não permitido.");
}

try {
    $db = Database::getInstance();
    
    // Verifica status básico da conexão, banco e versão
    $stmt = $db->query("SELECT 1 AS status, DATABASE() AS banco, VERSION() AS versao_mysql");
    $info = $stmt->fetch();
    
    // Verifica se a tabela usuarios existe
    $stmtTables = $db->query("SHOW TABLES LIKE 'usuarios'");
    $tabela_usuarios_existe = $stmtTables->rowCount() > 0;
    
    Response::json(200, true, "Conexão com o banco de dados estabelecida com sucesso.", [
        'banco' => $info['banco'],
        'versao_mysql' => $info['versao_mysql'],
        'tabela_usuarios_presente' => $tabela_usuarios_existe
    ]);
} catch (PDOException $e) {
    Response::json(500, false, "Erro técnico ao conectar com o banco de dados: " . $e->getMessage());
} catch (Exception $e) {
    Response::json(500, false, "Erro inesperado: " . $e->getMessage());
}
