import '../css/Skelton.css';

const Skeleton = ({ attempts }) => {
  const bodyParts = [
    { id: 'head', path: <circle cx="50" cy="30" r="20" className="skeleton-part" />, showUntil: 10 },
    { id: 'body', path: <line x1="50" y1="50" x2="50" y2="100" className="skeleton-part" />, showUntil: 9 },
    { id: 'left-arm', path: <line x1="50" y1="60" x2="20" y2="80" className="skeleton-part" />, showUntil: 8 },
    { id: 'right-arm', path: <line x1="50" y1="60" x2="80" y2="80" className="skeleton-part" />, showUntil: 7 },
    { id: 'left-leg', path: <line x1="50" y1="100" x2="30" y2="140" className="skeleton-part" />, showUntil: 6 },
    { id: 'right-leg', path: <line x1="50" y1="100" x2="70" y2="140" className="skeleton-part" />, showUntil: 5 },
    { id: 'left-hand', path: <circle cx="20" cy="80" r="3" className="skeleton-detail" />, showUntil: 4 },
    { id: 'right-hand', path: <circle cx="80" cy="80" r="3" className="skeleton-detail" />, showUntil: 3 },
    { id: 'left-knee', path: <circle cx="30" cy="140" r="3" className="skeleton-detail" />, showUntil: 2 },
    { id: 'right-knee', path: <circle cx="70" cy="140" r="3" className="skeleton-detail" />, showUntil: 1 },
  ];

  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-container">
        <svg width="80" height="120" viewBox="0 0 100 150">
          {bodyParts.map(part => 
            attempts < part.showUntil && (
              <g key={part.id}>
                {part.path}
                {attempts === 9 && part.id === 'head' && (
                  <path d="M40 40 Q50 45 60 40" className="skeleton-mouth" />
                )}
              </g>
            )
          )}
          {attempts >= 10 && (
            <g className="skeleton-death">
              <line x1="10" y1="10" x2="90" y2="150" className="skeleton-cross" />
              <line x1="90" y1="10" x2="10" y2="150" className="skeleton-cross" />
            </g>
          )}
        </svg>
        <div className="attempts-counter">Erreurs: {attempts}/10</div>
      </div>
    </div>
  );
};

export default Skeleton