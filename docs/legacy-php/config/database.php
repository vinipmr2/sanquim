<?php
declare(strict_types=1);

$host = getenv('DB_HOST') ?: 'localhost';
$usuario = getenv('DB_USER') ?: 'root';
$senha = getenv('DB_PASS') ?: '';
$banco = getenv('DB_NAME') ?: 'sanquim';

$link = mysqli_connect($host, $usuario, $senha, $banco);

if (!$link) {
    http_response_code(500);
    exit('Erro ao conectar ao banco de dados.');
}

mysqli_set_charset($link, 'utf8mb4');
