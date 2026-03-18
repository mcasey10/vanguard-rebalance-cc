# Vanguard Sell & Rebalance Tool — Developer Handoff

This is a self-initiated portfolio project by Michael Casey (Principal Product Designer).
It is a hypothetical tool — not affiliated with Vanguard Financial Services.

The tool addresses a real gap in Vanguard's product: when investors need to sell mutual
fund holdings, Vanguard provides no guidance on which funds or lots to sell to minimise
tax impact. This tool fills that gap with a tax-aware sell and rebalance workflow.

---

## Problem Statement

A Vanguard investor wants to withdraw $10,000 from their taxable brokerage account.
They hold multiple mutual funds, each with different tax lots at different gain/loss
positions. Selling the wrong fund or lot could trigger thousands of dollars in
unnecessary tax — but the investor has no tool to reason through this.

The tool must:
1. Recommend which funds to sell and how much, optimising for tax minimisation and
   portfolio rebalancing simultaneously
2. Allow the investor to manually override amounts and see the tax impact recalculate
   in real time
3. Surface actionable insights: losses being harvested, short-term lots near the
   long-term boundary, rebalancing effect

---

## User Flows

### Workflow A — Automated (AI-recommended)
1. **Balances screen** — investor sees their accounts and total portfolio value
2. Investor enters a withdrawal amount and requests a recommendation
3. **Fund List screen (Auto mode)** — engine recommends how much to sell per fund,
   with tax rationale per fund. Toggle between table and card views.
4. **Scenario Analysis screen** — full tax breakdown. Investor can edit amounts and
   add a second scenario for side-by-side comparison (see Scenario Analysis below).
5. **Confirmation screen** — order summary with trade references and tax summary

### Workflow B — Manual
1. **Balances screen** — same entry point
2. Investor navigates to Fund List in Manual mode
3. **Fund List screen (Manual mode)** — investor examines lot-level cost basis detail
   per fund to inform their decision, selects the accounting method (MinTax, FIFO,
   etc.), and enters a dollar amount per fund. The estimated tax impact updates live
   as amounts are entered.
4. **Scenario Analysis screen** — same as Workflow A from this point, including the
   ability to add a second scenario for comparison
5. **Confirmation screen** — same as Workflow A

### Convergence point
Workflow A and B converge at Scenario Analysis. A recommendation from Workflow A
can be pre-populated into the editable scenario inputs. Manual entries from Workflow B
are treated as Scenario A. From either starting point, the user can add a Scenario B
to compare side by side.

---

## Screen Inventory

| Route | Screen | Notes |
|---|---|---|
| `/portfolio/balances` | Balances | Account list, portfolio total, entry to sell flow |
| `/portfolio/sell-rebalance` | Fund List (Auto) | Recommendation view, table/cards toggle, lot expansion |
| `/portfolio/sell-rebalance/manual` | Fund List (Manual) | Lot expansion, method selection, live tax estimate |
| `/portfolio/sell-rebalance/scenarios` | Scenario Analysis | Tax breakdown, editable, two-scenario comparison |
| `/portfolio/sell-rebalance/confirmation` | Confirmation | Order summary, tax summary, rebalancing tiles |

---

## Fund List — Key Behaviours

### Lot expansion (both Auto and Manual modes)
Each fund row can be expanded to reveal its individual tax lots. This is not just
informational — in Manual mode it is the primary decision-support tool. The investor
examines lot detail (acquisition date, cost per share, short vs long term status,
unrealised gain/loss) to decide how much of that fund to sell and which accounting
method to use.

### Fund List — terminology and value consistency
- The column showing the current market value of each fund holding must use the
  **same label in both Auto and Manual modes**: "Current Value"
- The value must be calculated identically in both modes: `shares × current_nav`
- Do NOT use "Total Value" in Manual mode — all screens use "Current Value"
- The calculated value must match exactly between modes for the same fund
  (e.g. VBTLX: 1271 × $92.85 = $117,963.35 in both Auto and Manual)

### Fund List — Manual mode stats bar recalculation
- The bottom stats bar (Sale, ST Capital Gains, LT Capital Gains, Losses Harvested,
  Est. Total Tax, Eff. Tax Rate) must reflect the current sell amounts at all times
- The stats bar must call `/scenario` on page load with the initial sell amounts
  (even if pre-populated from URL params) — do not wait for the user to change an
  amount before making the first calculation
- If VBTLX shows a loss in the LT Gain/Loss column, Losses Harvested in the footer
  must reflect that loss — they must always be consistent

### Fund List — Manual mode gain/loss display
- The ST Gain/Loss and LT Gain/Loss columns in Manual mode must show **"—"** (dash)
  for any fund where the sell amount is $0 or empty
- These columns only show a calculated value when the user has entered a sell amount
  greater than zero — they represent the gain/loss **on the sale being entered**,
  not the total unrealised gain/loss on the holding
- This matches Auto mode behaviour where non-recommended funds (sell = $0) show "—"
  in the gain/loss columns
- Do NOT display the total holding-level unrealised gain/loss in these columns —
  that would mislead the user into thinking they have already decided to sell

### Accounting method selection (Manual mode)
Each fund in Manual mode has an accounting method selector (MinTax, FIFO, LIFO,
Specific Identification). The method determines which lots are selected when the
sale is calculated and directly affects the estimated tax shown. MinTax is the default.

### Wait & Save opportunity (both Auto and Manual modes)
When a fund has short-term tax lots that are within a configurable window (e.g. 60 days)
of converting to long-term status, the tool surfaces a warning: "Waiting N days could
save you $X in tax." This is relevant regardless of whether the user is in Auto or
Manual mode — it is triggered by lot data, not by workflow. The user can acknowledge
and proceed, or choose to wait.

---

## Scenario Analysis — Key Behaviours

### Single scenario view
Displays the full tax breakdown for the current sell plan: total sale amount, gains and
losses by term, losses harvested, net taxable gain, estimated federal and state tax,
effective rate, and the portfolio rebalancing impact (asset mix before and after).

### Two-scenario comparison
The user can add a second scenario (Scenario B) at any time from within Scenario
Analysis, regardless of whether they arrived via Workflow A or B. Both scenarios
are displayed side by side with editable amount inputs. The comparison allows the
investor to evaluate trade-offs between two different sell plans before executing.

### Editing and recalculation
Amount inputs in Scenario Analysis are editable. Changing an amount triggers a live
recalculation of the tax impact. If Scenario A has been modified from the original
recommendation, a "Reset to recommendation" option appears.

---

## Data Model

### Key entities and relationships

```
Investor
  └── Account (one or more)
        └── FundHolding (one per fund)
              └── TaxLot (one per purchase event)

SellRecommendation (output of optimisation engine — Workflow A)
  └── RecommendedFundSale (one line per fund)

ManualSellScenario (Workflow B, or user-edited Workflow A)
  └── ManualFundSale (one line per fund)
  └── ScenarioTaxImpact (rolled-up tax calculation)
```

### FundHolding (core entity, shown in Fund List)

| Field | Type | Notes |
|---|---|---|
| symbol | string | e.g. VTSAX |
| name | string | e.g. "Vanguard Total Stock Market Index" |
| asset_class | enum | us_equity, intl_equity, us_bond, intl_bond |
| total_shares | decimal | Sum of all open tax lots |
| current_nav | decimal | Net asset value per share |
| current_value | decimal | total_shares × current_nav |
| stcg_unrealized | decimal | Short-term unrealised gain/loss |
| ltcg_unrealized | decimal | Long-term unrealised gain/loss |
| target_allocation_pct | decimal | Investor's target weight |
| current_allocation_pct | decimal | Actual weight in portfolio |
| allocation_drift | decimal | current − target |

### TaxLot (expandable in Fund List — key decision-support data)

| Field | Type | Notes |
|---|---|---|
| acquisition_date | date | Purchase date — determines short vs long term |
| shares_remaining | decimal | Unsold shares |
| cost_per_share | decimal | Price at acquisition |
| holding_period | enum | short_term (< 1 year) or long_term (≥ 1 year) |
| unrealized_gain_loss | decimal | Current value minus cost basis |
| days_until_long_term | integer | Null if already long-term; drives Wait & Save warning |

**Important:** short_term and long_term are mutually exclusive per lot, determined
solely by whether acquisition_date is within or beyond one year of today.

### RecommendedFundSale (Workflow A output per fund)

| Field | Type | Notes |
|---|---|---|
| recommended_dollar_amount | decimal | Engine's recommended sell amount |
| estimated_ltcg | decimal | Long-term gain/loss component |
| estimated_stcg | decimal | Short-term gain/loss component |
| estimated_total_tax | decimal | Combined estimated tax |
| accounting_method | enum | mintax, fifo, lifo — method used for lot selection |
| lots_selected | array | Specific lots chosen by the engine |
| rebalancing_rationale | string | Why this fund was selected |
| days_until_lt_on_next_lot | integer | If any selected lots are near long-term boundary |

### ScenarioTaxImpact (rolled-up for full scenario)

| Field | Type | Notes |
|---|---|---|
| total_sale_amount | decimal | Sum of all fund sales |
| total_ltcg | decimal | Net long-term gain/loss |
| total_stcg | decimal | Net short-term gain/loss |
| losses_harvested | decimal | Total losses offsetting gains |
| net_taxable_gain | decimal | Gains after loss offsets |
| estimated_federal_tax | decimal | Federal component |
| estimated_state_tax | decimal | State component |
| estimated_total_tax | decimal | Combined |
| effective_tax_rate | decimal | estimated_total_tax / total_sale_amount |
| portfolio_drift_after | object | Per asset-class allocation after sale |

---

## Sample Data

### Investor context
- User: Michael · Portfolio total: $580,745.29
- Value as of: March 13, 2026, 4:15 p.m. ET

### Fund holdings (taxable brokerage account)

| Symbol | NAV | Shares | Value | Asset Class | Target | Current |
|---|---|---|---|---|---|---|
| VTSAX | $785.34 | 255 | ~$200,212 | us_equity | 32% | 34.4% |
| VBTLX | $92.85 | 1271 | ~$117,963 | us_bond | 20% | 20.3% |
| VFIAX | $519.37 | 168 | ~$87,254 | us_equity | 15% | 15.0% |
| VIGAX | $188.42 | 156 | ~$29,394 | us_equity | 5% | 5.1% |
| VXUS | $63.48 | 292 | ~$18,536 | intl_equity | 3% | 3.2% |

### Key tax lots

**VTSAX:**
- Short-term: 2 shares, acquired 2025-06-01, cost $764.34/share
- Long-term: 253 shares, acquired 2019-06-01, cost $101.31/share

**VBTLX:**
- Long-term loss lot: 1271 shares, acquired 2022-03-15, cost $135.10/share (currently at a loss)

**VFIAX:**
- Short-term lot 1: acquired 2025-04-04 (converts long-term April 4, 2026)
- Short-term lot 2: acquired 2025-05-01 (converts long-term May 1, 2026)

**VIGAX:** Long-term lot, acquired 2020-09-01, cost $130/share
**VXUS:** Long-term lot, acquired 2021-11-15, cost $55.20/share

### Data integrity requirement
The sample data must tell a **consistent tax loss harvesting story** across all screens
and modes. The following values are canonical and must not be altered:

- **VBTLX** is the only fund with an unrealised loss. It has a single long-term loss
  lot: 1271 shares acquired 2022-03-15 at $135.10/share. At current NAV of $92.85
  this is an unrealised loss of approximately −$53,720. This loss is what enables
  tax loss harvesting and must display consistently in Auto mode, Manual mode, lot
  expansion, and Scenario Analysis.
- If VBTLX shows a gain in any view, the lot data in `lib/data.ts` is incorrect.
- The VBTLX loss is the narrative backbone of the tool — without it, the tax
  optimisation story does not make sense to a user or a recruiter reviewing the demo.

### Canonical recommendation output (for $10,000 withdrawal)

| Fund | Sell Amount | Method | LT Gain/Loss | Est. Tax |
|---|---|---|---|---|
| VTSAX | $6,000 | MinTax | +$5,226 | $784 |
| VBTLX | $4,000 | FIFO | −$1,820 | −$273 |
| VFIAX | $0 | — | — | — |

**Summary:** $532 estimated total tax · 5.32% effective rate
Losses harvested: −$1,684 · Net taxable gain: $3,563

---

## API Specification

The backend is a FastAPI service that must be implemented as part of this project.
Do not reference or depend on any external existing implementation.

### POST /recommend
**Purpose:** Run the two-phase MinTax optimisation and return a sell recommendation.

Input:
```json
{ "account_id": "string", "withdrawal_amount": 10000 }
```

Output: SellRecommendation with per-fund breakdown including lot selection,
gain/loss by term, estimated tax per fund, and rebalancing rationale per fund.

**Algorithm intent (Phase 1 — fund allocation):**
Priority order: REBALANCE funds that are over-allocated → HARVEST loss lots →
FILL remaining amount from long-term gain funds → LAST RESORT short-term gain funds.
A cap prevents any single fund from consuming more than 60% of the withdrawal amount.
Funds within 0.5% of target allocation are not considered over-allocated.

**Algorithm intent (Phase 2 — lot selection within each fund):**
Priority order: short-term loss lots → long-term loss lots → long-term gain lots →
short-term gain lots. This minimises tax by harvesting losses first and deferring
short-term gains last.

### POST /scenario
**Purpose:** Pure tax calculation on user-supplied amounts. No optimisation.

Input:
```json
{
  "account_id": "string",
  "fund_amounts": {
    "VTSAX": 6000,
    "VBTLX": 4000,
    "VFIAX": 0,
    "VIGAX": 0,
    "VXUS": 0
  }
}
```

All five funds must always be sent, including those with $0. This is a hard requirement
— the tax netting calculation is portfolio-level and requires the full picture.

Output: ScenarioTaxImpact with total sale amount, gains/losses by term, losses
harvested, net taxable gain, estimated federal and state tax, effective rate,
and per-fund breakdown.

### POST /explain
**Purpose:** Generate a plain-English explanation of the recommendation using an LLM.

Input: `{ "recommendation_id": "string" }`
Output: Natural language summary of why each fund was selected, what losses are being
harvested, and what the rebalancing effect will be.

---

## Design Tokens

```css
--hero-dark:   #660026;   /* nav banner left fill */
--hero-red:    #C20029;   /* nav banner diagonal wedge (clip-path) */
--brand-red:   #C8102E;   /* active tab underline, negative values */
--interactive: #1255CC;   /* links, input focus */
--text:        #040505;
--text-mid:    #555555;
--text-muted:  #767676;
--positive:    #007A00;
--negative:    #C8102E;
--warning:     #E07000;
--bg:          #F2F2F2;
--paper:       #FFFFFF;
--border:      #E0E0E0;
--border-dark: #767676;
```

**Typography:** Inter (substitute for Vanguard's licensed FF Mark)
**Primary CTA:** `background: #040505`, `border-radius: 100px` pill shape. Never red.
**Hero banner:** Two flat fills — `#660026` base, `#C20029` diagonal wedge via
clip-path polygon. Not a gradient.

---

## Interaction States

This section describes empty states, modal triggers, and component-level interactions
that must be explicitly implemented. Do not infer defaults from sample data — follow
the states described here exactly.

### Fund List — Auto mode entry state
- The "Total Amount to Sell" input field is **empty on first load**
- The stats bar (sale amount, estimated tax, effective rate, rebalancing impact) is
  **hidden until the user enters an amount and clicks "Get Recommendation"**
- The fund table is **hidden until a recommendation exists**
- The button label is "Get Recommendation" on first visit; changes to "Recalculate"
  after a recommendation has been returned
- Do NOT pre-populate the amount field with any value

### Fund List — Cards view
- The Table/Cards toggle switches the fund list between two distinct layouts
- The Cards layout is defined in the Figma file as frame **S3 - Fund List Manual Card View**
  — this frame must be used as the visual reference for the cards implementation
- S2 (Table view) and S3 (Cards view) are two toggle states of the same route
  (`/portfolio/sell-rebalance/manual`) — they are NOT separate pages or routes
- **Table view:** rows with columns (Fund, Method, Value, ST Gain/Loss, LT Gain/Loss,
  Sell amount, Shares)
- **Cards view:** matches S3 Figma frame exactly — each fund is a full-width card with
  the fund name and ticker prominent, target/current allocation percentages, gain/loss
  indicators, method selector, sell amount input, and lot expansion inline. Cards with
  a Wait & Save opportunity show the warning inline within the card.
- The toggle applies in both Auto and Manual modes
- The toggle must visually indicate the active view (filled/dark = active)
- Switching between Table and Cards must not reset any entered sell amounts

### Wait & Save — modal dialog
The Wait & Save banner (shown when short-term lots are near long-term conversion) is
a trigger for a blocking modal dialog. The banner itself is not the full interaction.

**Modal trigger:** clicking anywhere on the Wait & Save banner, or a "Learn more" /
"See details" link within it, opens a modal dialog.

**Modal content:**
- Headline: "You could save $[X] by waiting [N] days"
- Explanation of which lots are short-term and when they convert
- Table showing: Fund | Lot date | Converts LT | Current tax | Tax if you wait | Savings
- Two actions:
  - "Remind me in 40 days" — dismisses modal, sets a reminder (can be non-functional
    in prototype but button must exist)
  - "Adjust sale to avoid these lots" — dismisses modal and removes the near-term
    short-term lots from the recommendation (can reload recommendation in prototype)
- "Proceed with today's recommendation" link — dismisses modal without changes

### Scenario Analysis — scenario naming
- Each scenario has an editable name displayed as a heading ("Scenario A — Minimize Tax")
- Clicking the scenario name heading makes it editable inline (text input replaces heading)
- Pressing Enter or clicking away saves the new name
- The name persists for the session

### Scenario Analysis — Scenario B entry state
- Scenario B is **not pre-populated** when first added
- Clicking "+ Add Scenario B" opens Scenario B with **all fund amounts set to $0**
- The user enters amounts manually; tax recalculates live as they type
- Do NOT pre-fill Scenario B with any recommended or default amounts

### Fund List — Auto/Manual mode switching
- The "Total Amount to Sell" input value must **persist when switching between Auto
  and Manual modes**
- Auto and Manual are separate routes (`/sell-rebalance` and `/sell-rebalance/manual`)
  — state is not shared between routes unless explicitly passed
- The mode toggle links must include the current amount as a URL parameter:
  - Switching Auto → Manual: navigate to `/sell-rebalance/manual?amount=10000`
  - Switching Manual → Auto: navigate to `/sell-rebalance?amount=10000`
- Each page must read the `?amount` URL parameter on load and pre-populate the
  Total Amount to Sell field with that value
- Do NOT reset the amount field when switching modes under any circumstances
- When Auto mode loads with an `?amount` URL parameter present, automatically
  trigger a recommendation fetch for that amount on load — do not show the empty
  state. The user has already indicated their withdrawal amount and expects to see
  the recommendation, not start over.

### Fund List — Wait & Save modal trigger (Manual mode)
- The Wait & Save modal must be triggerable in **both Auto and Manual modes**
- In Manual mode, when a fund row displays the WAIT & SAVE badge, clicking the badge
  or the warning text must open the same modal dialog as in Auto mode
- The modal content is identical in both modes — it shows the lot conversion data
  and savings regardless of which mode the user is in

### Workflow B — passing manual amounts to Scenario Analysis
This is the most critical Workflow B behaviour. When the user clicks "Analyze Scenario"
from the Fund List in Manual mode:
- The user's manually entered amounts must be passed directly to Scenario Analysis
  as the starting state for Scenario A
- Scenario Analysis must NOT call `/recommend` when arriving from Manual mode
- Scenario Analysis must NOT overwrite the user's amounts with recommendation values
- The correct flow: Manual mode amounts → passed via URL params or session state →
  Scenario Analysis reads them → calls `/scenario` with those amounts → displays results
- The sub-heading in Scenario Analysis should reflect the source:
  - From Auto mode: "Pre-filled from Recommendation · Edit any amount to recalculate"
  - From Manual mode: "Based on your manual entries · Edit any amount to recalculate"
- "Reset to Recommendation" should only appear when arriving from Auto mode and
  amounts have been modified

### Scenario Analysis — scenario name hover
- Hovering over a scenario name heading displays a **styled dark popover card**
  — not a native browser title attribute
- The popover is a custom component with dark background (`--text: #040505`),
  white text, `border-radius: 6px`, padding, and a drop shadow
- It appears below the scenario name heading on hover

**Popover content — three rows:**
- **Sell:** list of non-zero fund amounts, e.g. "VTSAX $6,000 + VBTLX $4,000"
- **Tax:** estimated total tax and effective rate, e.g. "$532 est. (5.32% effective rate)"
- **Note:** a short contextual description of what makes this scenario distinct:
  - For the unmodified recommendation: "Tax-optimised · harvests VBTLX loss to offset VTSAX gains"
  - For a user-modified scenario: "User-modified · [brief description of the dominant change,
    e.g. 'prioritizes reducing US equity drift']"
  - For a manual entry scenario: "Manual entry · [brief description]"

- The Note field should be generated dynamically based on the scenario state —
  it is not a static string
- Do NOT use the native HTML `title` attribute — it produces a plain browser tooltip
  that does not match the design

### Confirmation — passing executed amounts correctly
The Confirmation screen must display the exact amounts that were in Scenario Analysis
at the time the user clicked Execute — not the recommendation amounts.

- When executing Scenario A from Auto mode: show the Scenario A amounts (which may
  have been edited by the user, not necessarily the original recommendation)
- When executing Scenario A from Manual mode (Workflow B): show the manual amounts
  the user entered, which were carried through to Scenario Analysis
- When executing Scenario B: show Scenario B amounts
- The Confirmation screen must never call `/recommend` — it reads only the amounts
  passed to it via URL params or navigation state
- All amounts shown in the Orders Placed table must match exactly what was displayed
  in Scenario Analysis immediately before the user clicked Execute

**Implementation note:** The Execute button must pass the current Scenario A (or B)
fund amounts as URL parameters or router state to the Confirmation page. The
Confirmation page reads those params — it does not fetch or recalculate.

### Confirmation — Workflow B differentiation
- The Confirmation screen must display differently depending on which workflow executed:
  - **Workflow A:** shows "Tax Summary — Optimised" header, includes AI rationale note
    explaining what the optimisation engine saved vs a non-optimised approach
  - **Workflow B:** shows "Tax Summary — Manual Entry" header, omits AI rationale.
    Includes a note: "Automated optimisation would have reduced your tax by $[X]
    (Y% effective rate) — consider using the engine next time for potential savings"
- Executing from Scenario A in comparison view uses Workflow A confirmation
- Executing from Scenario B in comparison view uses Workflow B confirmation
- These must be distinct rendered states, not the same component with a label change

---

## How to Run

### Backend (FastAPI)
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
The API runs on `http://localhost:8001`. Port 8001 is used to avoid conflict with
other local services.

### Frontend (Next.js)
```bash
npm run dev
# Runs on http://localhost:3001
```

### Environment
Create `.env.local` in the project root (not in `/api`):
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```
The frontend reads `NEXT_PUBLIC_API_URL` for all API calls. This must be set before
running `npm run dev` — restart the dev server after creating the file.

### CORS
The backend must allow requests from `http://localhost:3001`. Ensure
`CORSMiddleware` in `api/main.py` includes this origin.

### Startup order
1. Start the backend first: `uvicorn main:app --reload --port 8001` (from `/api`)
2. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8001`
3. Start the frontend: `npm run dev` (from project root)
4. Open `http://localhost:3001/portfolio/balances`

---

## Scope Notes

This is a **functional prototype** — real computation and real API calls, no data
persistence or authentication. The following are intentionally out of scope:

- User authentication and session management
- Data persistence between sessions
- Wash sale rule enforcement
- RMD calculations
- Tax advice or guarantee (all estimates carry a disclaimer)
