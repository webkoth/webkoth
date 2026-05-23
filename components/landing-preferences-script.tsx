const SCRIPT = `
(function() {
  try {
    var html = document.documentElement;
    var palette = localStorage.getItem('palette');
    if (palette === 'classic') html.classList.add('palette-classic');
  } catch (e) {}
})();
`;

export function LandingPreferencesScript() {
  return (
    <script
      // No-flash: runs before paint. Inline + sync.
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
