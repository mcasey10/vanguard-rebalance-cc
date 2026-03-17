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

## Scope Notes

This is a **functional prototype** — real computation and real API calls, no data
persistence or authentication. The following are intentionally out of scope:

- User authentication and session management
- Data persistence between sessions
- Wash sale rule enforcement
- RMD calculations
- Tax advice or guarantee (all estimates carry a disclaimer)
