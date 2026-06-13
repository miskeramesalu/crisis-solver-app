const PressKitPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Press Kit</h1>
      <p>Download logos, screenshots, and fact sheet:</p>
      <ul className="list-disc ml-6 mt-4">
        <li><a href="/press/logo.png" download>Logo (PNG)</a></li>
        <li><a href="/press/screenshot1.png" download>Screenshot 1</a></li>
        <li><a href="/press/fact-sheet.pdf" download>Fact Sheet (PDF)</a></li>
      </ul>
    </div>
  );
};

export default PressKitPage;