# ServiceHub Business Plan

**Version:** 1.0  
**Prepared:** 25 November 2026  
**Status:** Working plan; validate assumptions before investment or launch.

## 1. Executive summary

ServiceHub is a secure, trust-focused marketplace for clients who need home and office cleaning, laundry, and mobile car wash services. Clients create an account, complete identity verification, submit a scoped service request, and pay a quote-based deposit before the request enters the administrator’s paid-request queue. An administrator reviews and manages accepted work through completion, invoicing, final payment, and closure.

The initial business should launch as a curated service provider rather than an open marketplace: ServiceHub itself (or a small vetted delivery team) supplies the services, controls estimates and deposits, and owns the client relationship. This keeps quality, pricing, and delivery accountable while the workflow is proven. A multi-provider marketplace can follow after operations and unit economics are established.

## 2. Problem and opportunity

Small service businesses lose time to anonymous enquiries, incomplete service details, no-shows, payment disputes, and unpaid discovery work. Customers often have little visibility into what happens after they submit an enquiry. ServiceHub addresses these problems by verifying accounts, collecting structured briefs, confirming a deposit before work is queued, and giving clients a trackable booking status.

The product’s trust promise must be accurate: identity checks reduce some fraud and impersonation risk, but cannot guarantee that a person is honest, that a document is genuine, or that a service will meet every expectation.

## 3. Customers and initial market

**Initial customer segments**

- Households, tenants, property managers, and small businesses needing reliable cleaning, laundry collection and delivery, or convenient mobile vehicle washing.
- Customers who value a documented process, clear estimates, and traceable payments.
- South African clients for the initial operating region; expand geography only after payment, privacy, support, and tax workflows are validated.

**Initial service catalogue**

Home cleaning; office cleaning; laundry (wash, dry, fold, and optional collection/delivery); mobile car wash (with clearly defined wash packages); and other cleaning on request. Each service needs an intake template, service area (suburb/city), street address, availability, inclusions/exclusions, and a pricing method (fixed package, size/room/load-based, or site-specific quote).

**Positioning**

“Convenient, verified booking for cleaning, laundry, and mobile car care.” Explain exactly what verification means and how documents are handled.

## 4. Value proposition

**For clients:** clear intake, visible request status, secure payment-provider checkout, written scope and quote, an accountable contact, and an auditable booking history.

**For the business:** fewer low-intent leads, structured requirements, a deposit before reserving delivery capacity, and a single operational record for requests, payments, approvals, and work.

## 5. Revenue model and pricing

Revenue initially comes from the service fees charged for delivered work. The deposit is a prepayment toward the quoted service, not extra revenue. A percentage deposit may be used only where it is clearly stated in the quote and terms; set a minimum deposit where payment fees or discovery effort justify one. Remaining balances are invoiced after service delivery or according to an agreed recurring-service schedule.

Recommended quoting sequence:

1. Client submits a short preliminary brief after verification.
2. ServiceHub reviews scope and issues an estimate/quote, including service inclusions, exclusions, appointment window, deposit, rescheduling/cancellation/refund terms, and quote expiry.
3. Client accepts the quote and pays the deposit through a hosted payment flow.
4. Payment provider confirms the transaction server-to-server; the system marks it verified and releases the request for admin review.

Do not calculate a binding deposit from an unreviewed free-text request. For example, a R1,500 home-cleaning quote could request a R450 deposit (30%). This is illustrative; actual prices and deposit rules should be set for each service and shown before payment.

## 6. Go-to-market plan

**Pilot:** launch with a narrow set of services and a small number of clients sourced through existing business contacts, referrals, and a simple service website. Offer a transparent, consistent process rather than competing on the lowest price.

**Acquisition:** publish service-specific landing pages and case studies; use referrals and partnerships with local small-business networks; capture leads with a concise value proposition and realistic response times.

**Retention:** provide timely status updates, clear scope change handling, downloadable invoices/receipts, and a post-completion feedback request. Obtain consent before using cleaning or vehicle photos as a public case study.

## 7. Operating model

- **Client operations:** support registration, explain verification requirements, handle resubmission requests, and resolve access issues.
- **Identity review:** use a reputable verification provider where viable; define manual exception review, reviewer access, escalation, and retention. Never treat face matching as infallible or make an irreversible adverse decision solely on a low-confidence automated result.
- **Request review:** check completeness and service fit, issue a written quote, and request clarification before payment when needed.
- **Delivery:** assign an accountable owner, schedule staff, record appointment changes, service completion, client feedback, and evidence for any reported issue.
- **Finance:** reconcile provider webhooks against provider transaction references, issue receipts/invoices, manage refunds and chargebacks, and reconcile balances.
- **Administration:** use role-based access, audit important actions, and review pending work daily.

## 8. Product and technology plan

Initial architecture: React web application; Spring Boot API; PostgreSQL; private object storage for identity documents and request attachments; email delivery; hosted checkout from a selected South African payment provider. Keep payment card data out of ServiceHub systems. Select one provider for the pilot based on supported payment methods, settlement/reconciliation, webhook security, fees, refunds, and operational support; add a second provider only when demand warrants it.

Build in phases:

1. **Operational foundation:** account registration, verification status, secure document upload, admin verification queue, request intake, quote/deposit flow, payment reconciliation, request dashboard, audit log.
2. **Service operations:** staff scheduling, appointment reminders, client/admin messaging, rescheduling, completion records, final invoice/payment, and service-quality follow-up.
3. **Expansion:** multiple admins, technician assignment, notifications, chat, ratings, contracts, mobile app, and carefully governed automation.

## 9. Key risks and controls

| Risk | Control |
|---|---|
| Identity documents or selfies exposed | Minimize collection; encrypted transfer/storage; private access; short, defined retention; audit document views; incident response process. |
| False acceptance/rejection from identity checks | Provider-backed checks plus human exception path, reason codes, resubmission/appeal route, and periodic quality review. |
| Payment spoofing or duplicate callbacks | Verify signed provider notifications server-side, make processing idempotent, reconcile against provider records, and never trust browser redirects as proof of payment. |
| Refund, cancellation, or scope disputes | Clear quote and terms, booking and service-completion records, client approval of changes, written refund policy, and evidence trail. |
| Delivery capacity exceeds sales | Limit pilot intake, publish realistic lead times, and track work-in-progress. |
| Regulatory/privacy gaps | Map data purposes and retention, appoint responsible privacy ownership, contract with operators, and obtain South African legal/accounting advice before launch. |
| Dependence on one provider | Maintain exportable records and a documented fallback; avoid exposing provider-specific implementation in client workflows. |

POPIA applies to processing personal information. The product should be designed around lawful and transparent processing, appropriate security safeguards, operator controls, and a documented response to security compromises. Assess whether any FIC Act duties apply to the actual business model rather than assuming identity checks automatically make ServiceHub an accountable institution. These documents are product planning, not legal advice. [POPIA, South African Government](https://www.gov.za/documents/protection-personal-information-act) · [Information Regulator: security compromises](https://inforegulator.org.za/2025/08/19/fact-sheet-handling-of-security-compromises/) · [FIC Act guidance](https://www.fic.gov.za/compliance/)

## 10. Success measures

Track monthly: qualified registration-to-verification completion; verification turnaround; verification resubmission and appeal rates; verified-to-quote conversion; quote-to-deposit conversion; payment failure rate; paid request acceptance rate; time to first admin response; on-time completion; refund/chargeback rate; gross margin by service; client satisfaction; and security incidents. Set targets after a pilot baseline rather than inventing unsupported forecasts.

## 11. Pilot gates

Proceed beyond pilot when the team can demonstrate: reliable provider payment reconciliation; a workable manual verification queue; predictable response and delivery times; positive contribution margin for at least the core service lines; manageable refund/dispute levels; and approved privacy, security, terms, and retention processes.

## 12. Decisions still needed

- Launch as a single service business or allow independent providers?
- Which cleaning packages, laundry options, car-wash packages, and service areas are included in the pilot? Who performs the work, and what supplies/equipment are provided?
- Which suburbs/cities are serviceable, and what are the travel charges? What are the rates by room/property size, laundry load or weight, and vehicle/package? Define travel charges, water/power access for mobile washing, deposits, cancellations, weather rescheduling, refunds, and service quality remedies.
- Which payment and identity providers fit the expected volume and data location needs?
- How long are identity files retained, and what triggers earlier deletion?
- What response time, support hours, and geographic coverage can be promised?
