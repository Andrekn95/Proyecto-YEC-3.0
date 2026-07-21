export const handleError = (error: any) => {
    let errorMessage = 'Ocurrió un error';

    switch (error.code) {
        case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
        case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'El correo ya está registrado';
            break;
        case 'auth/invalid-email':
            errorMessage = 'El correo no es válido';

            break;
        case 'auth/invalid-credential':
            errorMessage = 'Usuario y/o Contraseña no válidos';
            break;
        case 'auth/user-disabled':
            errorMessage = 'Usuario Suspendido';
            break;
        default:
            errorMessage = 'Error desconocido: ' + error.message;
            break;
    }

    return errorMessage;
};
