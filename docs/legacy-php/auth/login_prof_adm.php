<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../public/pages/login-professor.html');
    exit;
}

$usuario = trim($_POST['username'] ?? '');
$senha = $_POST['password'] ?? '';

if ($usuario === '' || $senha === '') {
    header('Location: ../../public/pages/login-professor.html?erro=1');
    exit;
}

$consulta = 'SELECT nivel FROM usuario WHERE usuario = ? AND senha = ? LIMIT 1';
$stmt = mysqli_prepare($link, $consulta);

if (!$stmt) {
    mysqli_close($link);
    header('Location: ../../public/pages/login-professor.html?erro=1');
    exit;
}

mysqli_stmt_bind_param($stmt, 'ss', $usuario, $senha);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) > 0) {
    mysqli_stmt_bind_result($stmt, $nivel);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    mysqli_close($link);

    if ($nivel === 'operador') {
        header('Location: ../../public/pages/dashboard/professor.html');
        exit;
    }

    if ($nivel === 'administrador') {
        header('Location: ../../public/pages/dashboard/coordenador.html');
        exit;
    }

    header('Location: ../../public/pages/login-professor.html?erro=1');
    exit;
}

mysqli_stmt_close($stmt);
mysqli_close($link);
header('Location: ../../public/pages/login-professor.html?erro=1');
exit;
