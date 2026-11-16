const genres = ['POLKA', 'SALSA', 'CUMBIA', 'BÖHMISCH', 'RUMBA', 'BLECHREGEN']

export function GenreTicker() {
  return <div className="concept-ticker" tabIndex={0} role="region" aria-label="Musikstile: Polka, Salsa, Cumbia, böhmisch und Rumba. Das Laufband hält bei Fokus an.">
    <div className="ticker-track" aria-hidden="true">{[0, 1, 2, 3].map(copy => <div className="ticker-set" key={copy}>{genres.map(genre => <span className="ticker-item" key={genre}><span className="ticker-word">{genre}</span><svg className="ticker-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" strokeWidth="2.5"/></svg></span>)}</div>)}</div>
  </div>
}
