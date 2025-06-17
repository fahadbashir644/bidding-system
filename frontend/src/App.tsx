import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionForm } from "./Components/AuctionForm/AuctionForm";
import { AuctionCard } from "./Components/AuctionCard/AuctionCard";
import type { AuctionItem } from "./Interfaces/AuctionItem";
import { toast } from "react-toastify";

export default function App() {
  const [items, setItems] = useState<AuctionItem[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8088/items");
      setItems(res.data);
    } catch (err) {
      toast.error("Could not load auction items.");
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await axios.post("http://localhost:8088/items", formData);
      fetchItems();
      toast.success("Item created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create item.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Real-Time Auction Dashboard</h1>
      <AuctionForm onCreate={handleCreate} />
      <div className="row g-4">
        {items.map((item) => (
          <div className="col-sm-6 col-md-4" key={item.id}>
            <AuctionCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
