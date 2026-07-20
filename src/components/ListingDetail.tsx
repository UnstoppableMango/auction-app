import { useEffect, useState } from "react";
import type { BidRequest, Listing } from "../types";
import BidForm from "./BidForm";
import { getBids } from "../api/listings";

interface Props {
	listing: Listing;
	onBidSuccess: (updated: Listing) => void;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function timeRemaining(endsAt: string): number {
	return new Date(endsAt).getTime() - Date.now();
}

function formatRemaining(time: number): string {
	const d = new Date(time);
	const hours = d.getHours();
	if (hours >= 24) {
		return `${hours / 24} Days`;
	}
	if (hours > 1) {
		return `${hours} Hours`;
	}
	return `${d.getSeconds()} Seconds`;
}

export default function ListingDetail({ listing, onBidSuccess }: Props) {
	const [history, setHistory] = useState<BidRequest[]>([]);
	const [remaining, setRemaining] = useState(timeRemaining(listing.endsAt));

	useEffect(() => {
		const interval = setInterval(() => {
			setRemaining(timeRemaining(listing.endsAt))
		}, 1_000);

		return () => clearInterval(interval);
	}, [listing.endsAt]);

	// Dependency on currentBid so that history is re-fetched when bids change
	useEffect(() => {
		getBids(listing.id)
			.then(setHistory)
			.catch(err => err instanceof Error ? err.message : "Failed to fetch bids")
	}, [listing.id, listing.currentBid]);

	return (
		<div className="listing-detail">
			<img
				src={listing.imageUrl}
				alt={listing.title}
				className="listing-detail__image"
			/>
			<div className="listing-detail__header">
				<span className={`badge badge--${listing.category}`}>
					{listing.category}
				</span>
				<span className={`status-badge status-badge--${listing.status}`}>
					{listing.status}
				</span>
			</div>
			<h2 className="listing-detail__title">{listing.title}</h2>
			<p className="listing-detail__description">{listing.description}</p>

			<div className="listing-detail__meta">
				<div className="meta-row">
					<span className="meta-label">Starting Price</span>
					<span className="meta-value">
						${listing.startingPrice.toLocaleString()}
					</span>
				</div>
				<div className="meta-row">
					<span className="meta-label">Current Bid</span>
					<span className="meta-value meta-value--highlight">
						${listing.currentBid.toLocaleString()}
					</span>
				</div>
				<div className="meta-row">
					<span className="meta-label">Current Bidder</span>
					<span className="meta-value">
						{listing.currentBidder ?? "No bids yet"}
					</span>
				</div>
				<div className="meta-row">
					<span className="meta-label">Auction Ends</span>
					<span className="meta-value">{formatDate(listing.endsAt)}</span>
				</div>
				<div className="meta-row">
					<span className="meta-label">Time Remaining</span>
					<span className="meta-value">{formatRemaining(remaining)}</span>
				</div>
			</div>

			{/* Visible regardless of active status; i.e. displays history after bidding has ended */}
			<ul className="listing-detail__history">
				{history.map((bid, i) => (
					<li key={i}>
						<strong>{bid.bidder}</strong>: <span>${bid.amount.toLocaleString()}</span>
					</li>
				))}
			</ul>

			{listing.status === "active" && (
				<BidForm listing={listing} onBidSuccess={onBidSuccess} />
			)}
		</div>
	);
}
