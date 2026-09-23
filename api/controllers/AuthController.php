<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function cadastrar($dados) {
        $nome = trim($dados['nome'] ?? '');
        $email = trim($dados['email'] ?? '');
        $senha = $dados['senha'] ?? '';

        if (empty($nome) || empty($email) || empty($senha)) {
            Response::json(400, false, "Todos os campos (nome, email, senha) são obrigatórios.");
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::json(400, false, "Formato de e-mail inválido.");
        }

        if (strlen($senha) < 6) {
            Response::json(400, false, "A senha deve ter pelo menos 6 caracteres.");
        }

        try {
            // Verifica se o e-mail já existe
            $stmt = $this->db->prepare("SELECT id FROM usuarios WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            if ($stmt->fetch()) {
                Response::json(409, false, "Este e-mail já está em uso.");
            }

            // Insere o novo usuário
            $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (:nome, :email, :senha)");
            $sucesso = $stmt->execute([
                ':nome' => $nome,
                ':email' => $email,
                ':senha' => $senhaHash
            ]);

            if ($sucesso) {
                $userId = $this->db->lastInsertId();
                Response::json(201, true, "Usuário cadastrado com sucesso.", [
                    'id' => $userId,
                    'nome' => $nome,
                    'email' => $email
                ]);
            } else {
                Response::json(500, false, "Falha ao cadastrar o usuário.");
            }
        } catch (PDOException $e) {
            Response::json(500, false, "Erro interno do servidor.");
        }
    }

    public function login($dados) {
        $email = trim($dados['email'] ?? '');
        $senha = $dados['senha'] ?? '';

        if (empty($email) || empty($senha)) {
            Response::json(400, false, "E-mail e senha são obrigatórios.");
        }

        try {
            $stmt = $this->db->prepare("SELECT id, nome, email, senha FROM usuarios WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $usuario = $stmt->fetch();

            if ($usuario && password_verify($senha, $usuario['senha'])) {
                // Autenticação bem sucedida
                unset($usuario['senha']); // Remove a senha dos dados retornados
                Response::json(200, true, "Login realizado com sucesso.", $usuario);
            } else {
                Response::json(401, false, "E-mail ou senha incorretos.");
            }
        } catch (PDOException $e) {
            Response::json(500, false, "Erro interno do servidor.");
        }
    }
}
