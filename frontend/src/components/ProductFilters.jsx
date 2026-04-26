const ProductFilters = ({
  busca,
  setBusca,
  categorias,
  filtroCategoria,
  filtroEstoque,
  aplicarFiltro,
  limparFiltro,
}) => {
  return (
    <div className="row align-items-end g-3 mb-3">
      <div className="col-md-6">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                aplicarFiltro(filtroCategoria, filtroEstoque, busca);
              }
            }}
          />

          <button
            className="btn btn-primary"
            onClick={() => aplicarFiltro(filtroCategoria, filtroEstoque, busca)}
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="col-md-6">
        <div className="d-flex gap-2 flex-wrap justify-content-md-end">
          <button
            className="btn btn-outline-warning"
            onClick={() => aplicarFiltro(filtroCategoria, 'baixo', busca)}
          >
            Estoque baixo
          </button>

          <select
            className="form-select"
            style={{ maxWidth: '300px' }}
            value={filtroCategoria || ''}
            onChange={(e) =>
              aplicarFiltro(e.target.value, filtroEstoque, busca)
            }
          >
            <option value="">Todas categorias</option>
            {categorias.map((cat) => (
              <option key={cat.cod_categoria} value={cat.cod_categoria}>
                {cat.nome_categoria}
              </option>
            ))}
          </select>

          <button className="btn btn-outline-secondary" onClick={limparFiltro}>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
