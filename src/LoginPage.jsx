import React, { useState } from 'react';

const API_BASE_URL = 'https://www.hs-service.api.crealape.com/api/v1';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json(); 

            if (response.ok) { 
                setMessage({ type: 'success', text: 'Inicio de sesión exitoso. Redirigiendo...' });
                onLoginSuccess(); 
            } else {
                setMessage({ type: 'error', text: data.message || 'Credenciales inválidas o error de servidor.' });
                console.error('Error de inicio de sesión:', data);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de red o del servidor.' });
            console.error('Error al iniciar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 font-poppins text-gray-800">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-sm sm:max-w-md w-full">
                <h1 className="text-center text-blue-600 mb-6 sm:mb-8 text-2xl sm:text-3xl font-extrabold">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@funval.test"
                            required
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out"
                        />
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123456"
                            required
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out"
                        />
                    </div>
                    <div className="text-center mt-6 sm:mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                    {message.text && (
                        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center font-bold text-sm sm:text-base ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;