import React, { useState, useEffect } from "react";
import type { AuctionCardProps } from "../../Interfaces/AuctionCardProps";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import type { Bid } from "../../Interfaces/Bid";

const socket = io("http://159.65.148.214:8088");

export const AuctionCard: React.FC<AuctionCardProps> = ({ item }) => {
  const [bidInput, setBidInput] = useState<number>(0);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(
    new Date(item.endTime).getTime() - Date.now()
  );
  const [bids, setBids] = useState<Bid[]>(item?.bids || []);
  const [showBids, setShowBids] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(item.endTime).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [item.endTime]);

  useEffect(() => {
    const maxBid =
      item?.bids?.length > 0
        ? Math.max(...item.bids.map((p) => p.amount))
        : 0;

    setCurrentBid(maxBid);
    setBids(item?.bids || []);

    socket.on("bidUpdate", ({ itemId, amount, userId, user }) => {
      if (itemId === item.id && amount > currentBid) {
        setCurrentBid(amount);
        setBids((prev) => {
        const exists = prev.some(b => b.amount === amount && b.userId === userId);
          if (exists) return prev;
          return [{ amount, itemId, userId, user }, ...prev];
        });
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
      const res = await axios.post(`http://159.65.148.214:8088/items/bid`, {
        itemId,
        amount: bidAmount,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Bid placed successfully");
      setBidInput(0);
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
        <p className="mb-1">
          <strong>Starting:</strong> ${item.startingPrice}
        </p>
        <p className="mb-1">
          <strong>Current Bid:</strong> ${currentBid || item.startingPrice}
        </p>
        <p className="text-danger mb-3">
          <strong>Time Left:</strong> {minutes}m {seconds}s
        </p>

        <div className="mt-auto d-flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Your Bid"
            value={bidInput}
            onChange={(e) => setBidInput(Number(e.target.value))}
            className="form-control w-50"
          />
          <button
            disabled={timeLeft <= 0}
            className="btn btn-success"
            onClick={() => handleBid(item.id, bidInput)}
          >
            Place Bid
          </button>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm mb-2"
          onClick={() => setShowBids(!showBids)}
        >
          {showBids ? "Hide Bid History" : "Show Bid History"}
        </button>

        {showBids && (
      <div
        className="position-absolute bg-white border rounded shadow-sm"
        style={{
          top: '100%',
          left: 0,
          zIndex: 10,
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        {bids.length === 0 ? (
            <p className="text-muted">No bids yet.</p>
          ) : (
          <ul className="list-group list-group-flush">
            {bids.map((bid, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between py-1 px-2"
              >
                <span>{bid?.user?.name}</span>
                <span>${bid.amount}</span>
              </li>
            ))}
          </ul>
          )}
      </div>
    )}
    
      </div>
    </div>
  );
};
