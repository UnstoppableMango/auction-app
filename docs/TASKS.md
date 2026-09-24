# Tasks

## Find the bugs in bidding

There are bugs when bidding on an auction lot. Fix these bugs in any way you feel comfortable. Recreation Steps:

- Click on a listing
- Place a bid that is higher than the current bid
- See the errors

## Primary Tasks - Work on 1 or more of the following tasks

### Bid History

The app only tracks the current leading bid. There's no record of past bids — who bid what and when. Add bid history tracking.

Requirements

- When a valid bid is placed, record it
- Expose the history for a given listing via an endpoint
- Bids are returned in reverse chronological order
- A listing with no bids yet is a different case from a listing that doesn't exist — handle them distinctly

### Paginate Auction Lots with a bonus of adding filters

Add pagination and filtering to loading Auction Lots. The listings endpoint returns all records in a single response. Clients need a way to fetch them in pages.

Requirements

- Clients can specify a page and page size
- The response includes enough metadata for a client to know the total number of results and whether more pages exist
- Composes with any filtering or sorting already in place
- Bonus add meaningful filters as well

### Show an Auction Lot Count Down

Listing cards show an endsAt timestamp but there's no live indication of how much time is left. Add a countdown to each listing.

Requirements

- Each listing card displays the time remaining until the auction closes
- The countdown updates in real time without a page refresh
- When an auction ends, the listing reflects its closed state without requiring a reload
- The display is appropriate for the time remaining — the format for 3 days left should differ from 45 seconds left

### Add Realtime Bid Updates and Expiring

Add the ability to do realtime bidding and handle any edge cases that seem applicable.

Requirements

- All auctions should update with real time highest bidder
- Should be able to connect multiple bidders
- Should expire auctions realtime
