export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      onClick={toggle}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 14px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer"
      }}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
