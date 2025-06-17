import React, { useState, useEffect } from "react";
import type { AuctionCardProps } from "../../Interfaces/AuctionCardProps";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:8088");

export const AuctionCard: React.FC<AuctionCardProps> = ({ item }) => {
  const [bidInput, setBidInput] = useState<number>(0);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(new Date(item.endTime).getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(item.endTime).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [item.endTime]);

  useEffect(() => {
    const maxBid = item?.bids?.length > 0
      ? Math.max(...item?.bids?.map(p => p.amount))
      : 0;
      setCurrentBid(maxBid);
      
    socket.on("bidUpdate", ({ itemId, amount }) => {
      if (itemId === item.id && amount > currentBid) {
        setCurrentBid(amount);
      }
    });
  
    return () => {
      socket.off("bidUpdate");
    };
  }, []);

  const handleBid = async (itemId: string, bidAmount: number) => {

    if (bidAmount < Math.max(currentBid || 0, item.startingPrice)) {
      toast.error("Your bid must be higher than the current highest bid");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8088/items/bid`, {
        itemId: itemId,
        amount: bidAmount,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setCurrentBid(bidInput);
      toast.success('Bid added successfully');
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place bid.");
    }
  };

  const minutes = Math.max(Math.floor(timeLeft / 60000), 0);
  const seconds = Math.max(Math.floor((timeLeft % 60000) / 1000), 0);

  return (
   <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{item.name}</h5>
        <p className="card-text small text-muted">{item.description}</p>
        <p className="mb-1"><strong>Starting:</strong> ${item.startingPrice}</p>
        <p className="mb-1"><strong>Current Bid:</strong> ${currentBid || item.startingPrice}</p>
        <p className="text-danger mb-3"><strong>Time Left:</strong> {minutes}m {seconds}s</p>
        <div className="mt-auto d-flex gap-2">
          <input
            type="number"
            placeholder="Your Bid"
            value={bidInput}
            onChange={(e) => setBidInput(Number(e.target.value))}
            className="form-control w-50"
          />
          <button disabled={timeLeft <= 0} className="btn btn-success" onClick={() => handleBid(item.id, bidInput)}>
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};