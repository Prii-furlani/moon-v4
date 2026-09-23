<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../utils/Response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::json(405, false, "Método não permitido.");
}

$inputJSON = file_get_contents('php://input');
$dados = json_decode($inputJSON, true);

if (!$dados) {
    Response::json(400, false, "JSON inválido ou ausente.");
}

$controller = new AuthController();
$controller->cadastrar($dados);
