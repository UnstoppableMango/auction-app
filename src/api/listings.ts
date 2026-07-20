import type { BidRequest, Listing } from "../types";

interface ListingRequest {
	page?: number;
	size?: number;
	filter?: string;
}

interface ListingResponse {
	items: Listing[];
	page: number;
	size: number;
	total: number;
}

export async function getListings(req: ListingRequest = {}): Promise<ListingResponse> {
	const params = new URLSearchParams({
		page: String(req.page ?? 0),
		size: String(req.size ?? 10),
	});

	if (req.filter) {
		params.set('filter', encodeURIComponent(req.filter))
	}

	const res = await fetch("/api/listings?" + params.toString());
	if (!res.ok) throw new Error("Failed to fetch listings");
	return res.json();
}

export async function getListing(id: string): Promise<Listing> {
	const res = await fetch(`/api/listings/${id}`);
	if (!res.ok) throw new Error("Failed to fetch listing");
	return res.json();
}

export async function createListing(data: { title: string }): Promise<Listing> {
	const res = await fetch("/api/listings", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || body.detail || "Failed to create listing");
	}
	return res.json();
}

export async function placeBid(
	listingId: string,
	bidder: string,
	amount: number,
): Promise<Listing> {
	const res = await fetch(`/api/listings/${listingId}/bids`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ bidder, amount }),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error || data.detail || "Failed to place bid");
	}
	return res.json();
}

export async function getBids(listingId: string): Promise<BidRequest[]> {
	const res = await fetch(`/api/listings/${listingId}/bids`);
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error || data.detail || "Failed to fetch bids");
	}
	return res.json();
}
