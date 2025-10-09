import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [sequence, setSequence] = useState([]);
  const [strategy, setStrategy] = useState("max"); // default strategy

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

  useEffect(() => {
    fetchSequence();
  }, [strategy]);

  return (
    <div className="min-h-screen bg-bg text-text flex items-start justify-center p-8">
      <div className="flex w-full max-w-7xl gap-8">
        {/* Left Side - Upload / Booking Form */}
        <div className="w-1/2 bg-card rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Upload & Booking</h2>

            {/* Strategy Selector */}
            <div className="flex items-center gap-3 mb-6">
              <label className="font-medium text-text">Boarding Strategy:</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="border border-accent rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="max">🕐 Max Boarding Time (Back to Front)</option>
                <option value="min">🚶 Min Boarding Time (Front to Back)</option>
              </select>
            </div>

            <BookingForm onUploadSuccess={fetchSequence} />
          </div>

          <p className="text-sm text-gray-500 mt-6 italic">
            Upload your Excel sheet and view optimized boarding sequence.
          </p>
        </div>

        {/* Right Side - Results Table */}
        <div className="w-1/2 bg-card rounded-2xl shadow-xl p-6 max-h-[80vh] flex flex-col">
          <h2 className="text-2xl font-bold text-accent mb-4">Boarding Sequence Result</h2>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ResultTable sequence={sequence} />
          </div>
        </div>
      </div>
    </div>
  );
}
