import React from 'react';

const LevelSelector = ({ level, setLevel }) => (
  <div className="level-selector">
    <select value={level} onChange={(e) => setLevel(e.target.value)}>
      <option value="easy">Facile (4-6 lettres)</option>
      <option value="medium">Moyen (7-9 lettres)</option>
      <option value="hard">Difficile (10+ lettres)</option>
    </select>
  </div>
);

export default LevelSelector;