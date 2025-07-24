import React from 'react'
import { Link } from 'react-router-dom';

export default function CategoriesCard({id,name,description}) {
  return (
    <Link to={`/categories/${id}`}>
    <div className="bg-blue-500 w-50 h-40 rounded-2xl shadow-md p-6 text-white hover:scale-105 transition-transform duration-300">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm">{description}</p>
    </div>
    </Link>
  );
}
