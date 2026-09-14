export default function HomePage() {
  return (
    <main style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", background: "#18160F" }}>
      <iframe
        src="https://pot-and-thyme-test.vercel.app/"
        title="Pot & Thyme"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="clipboard-read; clipboard-write"
      />
    </main>
  );
}
