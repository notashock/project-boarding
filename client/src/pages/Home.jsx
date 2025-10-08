import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [sequence, setSequence] = useState([]);
  const [strategy, setStrategy] = useState("max"); // default strategy

  // Fetch sequence from backend with selected strategy
  const fetchSequence = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/boarding-sequence?strategy=${strategy}`
      );
      const data = await res.json();
      setSequence(data.sequence || []);
    } catch (err) {
      console.error("Failed to fetch boarding sequence:", err);
    }
  };

  // Fetch whenever strategy changes
  useEffect(() => {
    fetchSequence();
  }, [strategy]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Trigger to switch strategy */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <label className="font-medium">Boarding Strategy:</label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="max">Max Boarding Time (Back to Front)</option>
          <option value="min">Min Boarding Time (Front to Back)</option>
        </select>
      </div>

      {/* Booking form */}
      <BookingForm onUploadSuccess={fetchSequence} />

      {/* Display sequence */}
      <ResultTable sequence={sequence} />
    </div>
  );
}
