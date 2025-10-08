import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [sequence, setSequence] = useState([]);

  const fetchSequence = async () => {
    const res = await fetch("http://localhost:5000/api/boarding-sequence");
    const data = await res.json();
    setSequence(data);
  };

  useEffect(() => {
    fetchSequence();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BookingForm onBookingCreated={fetchSequence} />
      <ResultTable sequence={sequence} />
    </div>
  );
}
