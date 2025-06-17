import React, { useState } from "react";
import type { AuctionFormProps } from "../../Interfaces/AuctionFormProps";

export const AuctionForm: React.FC<AuctionFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingPrice: "",
    durationMinutes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      startingPrice: parseFloat(formData.startingPrice),
      endTime: parseInt(formData.durationMinutes),
    });
    setFormData({
      name: "",
      description: "",
      startingPrice: "",
      durationMinutes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4 shadow-sm">
      <h2 className="mb-3">Create a New Auction</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="startingPrice"
            type="number"
            placeholder="Starting Price"
            value={formData.startingPrice}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="durationMinutes"
            type="number"
            placeholder="Duration (minutes)"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Create Auction Item
      </button>
    </form>
  );
};
