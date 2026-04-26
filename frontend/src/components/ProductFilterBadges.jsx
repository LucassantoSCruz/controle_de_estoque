const ProductFilterBadges = ({
  filtroEstoque,
  filtroCategoria,
  filtroNome,
  categorias,
}) => {
  return (
    <div className="d-flex gap-2 mb-3">
      {filtroEstoque && (
        <span className="badge bg-warning text-dark">Estoque baixo</span>
      )}

      {filtroCategoria && (
        <span className="badge bg-primary">
          Categoria:{' '}
          {categorias.find(
            (cat) => String(cat.cod_categoria) === String(filtroCategoria)
          )?.nome_categoria || '—'}
        </span>
      )}

      {filtroNome && <span className="badge bg-dark">Busca: {filtroNome}</span>}
    </div>
  );
};

export default ProductFilterBadges;
