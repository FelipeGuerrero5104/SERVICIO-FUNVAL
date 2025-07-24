import CategoriesCard from "./CategoriesCard";
import useCategorias from "./hooks/useCategories";

export default function ListCategories() {
    const { categorias, loading } = useCategorias();

  if (loading) return <p className="text-center text-gray-500">Cargando categorías...</p>;


  return (
    <div className="flex justify-center items-center">
    <section className="grid place-items-center place-content-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {categorias.map((cat) => (
        <CategoriesCard
          key={cat.id}
          id={cat.id}
          name={cat.name}
          description={cat.description}
        />
      ))}
    </section>
    </div>
  );
}
