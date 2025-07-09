import React from "react";

const Stats = ({ documents, vectors, mb }) => (
  <div className="grid grid-cols-3 gap-2 bg-white bg-opacity-60 rounded-xl p-2 text-center text-sm text-gray-700 shadow">
    <div>
      <div className="font-bold text-lg">{documents}</div>
      <div>DOCUMENTS</div>
    </div>
    <div>
      <div className="font-bold text-lg">{vectors}</div>
      <div>VECTEURS</div>
    </div>
    <div>
      <div className="font-bold text-lg">{mb}</div>
      <div>MB</div>
    </div>
  </div>
);

export default Stats; 