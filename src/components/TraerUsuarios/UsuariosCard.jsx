import React from 'react'

export default function UsuariosCard({full_name,email,phone,role}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold">{full_name}</h2>
              <p className="text-sm text-gray-600">{email}</p>
              <p className="text-sm text-gray-600">{phone}</p>
              <p className="text-sm text-gray-600">Rol: {role}</p>
              <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                Info
              </button>
            </div>
  )
}
