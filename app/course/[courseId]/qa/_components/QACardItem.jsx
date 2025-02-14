import React from "react";

function QACardItem({ qa }) {
  return (
    <div>
      <div className="border p-3 rounded-lg bg-gray-100 mt-10">
        <p className="font-medium">{qa?.question}</p>
        <p className="text-gray-700 mt-2">
          <strong>Answer:</strong> {qa?.answer}
        </p>
      </div>
    </div>
  );
}

export default QACardItem;
