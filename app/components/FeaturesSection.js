export default function FeaturesSection() {
    return (
      <section className='text-center my-5'>
        <h3>Perché scegliere il nostro sistema di gestione?</h3>
        <div className='row mt-4'>
          <div className='col-md-4'>
            <i className="fa fa-cogs fa-3x mb-3" aria-hidden="true"></i>
            <h4>Facile da usare</h4>
            <p>Interfaccia intuitiva per gestire facilmente il tuo inventario.</p>
          </div>
          <div className='col-md-4'>
            <i className="fa fa-line-chart fa-3x mb-3" aria-hidden="true"></i>
            <h4>Statistiche Avanzate</h4>
            <p>Ottieni report dettagliati sulle vendite e sui prodotti.</p>
          </div>
          <div className='col-md-4'>
            <i className="fa fa-shield fa-3x mb-3" aria-hidden="true"></i>
            <h4>Sicurezza Garantita</h4>
            <p>Protezione dei dati all'avanguardia per il tuo negozio.</p>
          </div>
        </div>
      </section>
    );
}