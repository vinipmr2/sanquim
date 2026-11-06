<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../public/pages/login-aluno.html');
    exit;
}

$usuario = trim($_POST['username'] ?? '');
$senha = $_POST['password'] ?? '';

if ($usuario === '' || $senha === '') {
    header('Location: ../../public/pages/login-aluno.html?erro=1');
    exit;
}

$consulta = 'SELECT nivel FROM usuario WHERE usuario = ? AND senha = ? AND nivel = ? LIMIT 1';
$stmt = mysqli_prepare($link, $consulta);

if (!$stmt) {
    mysqli_close($link);
    header('Location: ../../public/pages/login-aluno.html?erro=1');
    exit;
}

$nivel = 'usuario';
mysqli_stmt_bind_param($stmt, 'sss', $usuario, $senha, $nivel);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) > 0) {
    mysqli_stmt_close($stmt);
    mysqli_close($link);
    header('Location: ../../public/pages/dashboard/aluno.html');
    exit;
}

mysqli_stmt_close($stmt);
mysqli_close($link);
header('Location: ../../public/pages/login-aluno.html?erro=1');
exit;
