# ServiceHub User Workflow

**Version:** 1.0  
**Date:** 25 November 2026

## 1. Client journey

### A. Discover and register

1. Visitor views services, pricing approach, privacy notice, terms, and support details.
2. Visitor registers with name, surname, email, phone number, and password.
3. System validates fields, creates the account as `PENDING_VERIFICATION`, and sends an email verification link/code.
4. Client confirms email and signs in to a restricted verification area. They cannot create a service request yet.

### B. Verify identity

5. Client selects an accepted document type (South African ID, passport, or driver’s licence), uploads the document, and takes/uploads a selfie.
6. System explains purpose, handling, and retention, obtains any required acknowledgement, and shows upload progress and next steps.
7. System validates file constraints and queues provider checks and/or human review.
8. Client sees `UNDER_REVIEW` and an expected response window.
9. If approved, account becomes `VERIFIED` and the client receives a notification and dashboard access.
10. If further information is needed, client sees a specific reason and a secure resubmission action; the new submission is linked to the case history.
11. If rejected, client receives a reason category and appeal/support route. The system records reviewer and decision; the client cannot submit requests unless reinstated as verified.

### C. Prepare a request and receive a quote

12. Client chooses Home Cleaning, Office Cleaning, Laundry Service, Mobile Car Wash, or Other Cleaning Service.
13. Client enters a request title, requesting area (suburb/city), street address, preferred service date and time window, and service details. Cleaning captures rooms and tasks; laundry captures load/items, preferences, and pickup/delivery; mobile car wash captures vehicle and package details plus parking and water/power access. Attachments are optional.
14. Client saves a draft or submits it for scoping. Status becomes `AWAITING_QUOTE`.
15. Admin reviews service fit and completeness. If details are missing, admin requests information; client replies in the request thread and status returns to review.
16. Admin creates a versioned quote with service package and inclusions, location/date, quoted total, deposit, remaining balance, appointment window, expiry, and rescheduling/cancellation terms.
17. Client reviews the quote and explicitly accepts it. If declined or expired, client can ask for revision or close the request.

### D. Pay deposit and submit for admin decision

18. Client selects **Pay deposit** and is redirected to hosted payment checkout.
19. Payment provider processes the chosen payment method. The return page reports “processing” until the server verifies the provider notification/reconciliation.
20. On confirmed payment, payment becomes `PAID`, request becomes `PAID_PENDING_REVIEW`, and both client and admin receive confirmation.
21. If failed, client can retry. If pending or mismatched, the request stays out of the paid review queue and a payment exception is visible to authorized staff.

### E. Admin review and service delivery

22. Admin checks service area, requested work, availability, and deposit, then chooses **Accept**, **Reject**, or **Request more information**. On acceptance, admin assigns a cleaner/driver and confirms the appointment window.
23. On accept, booking becomes `ACCEPTED`; the client receives a decision and expected next step.
24. On reject, admin records a reason and refund disposition. If a refund is due, it proceeds through a tracked refund state and provider confirmation.
25. Once scheduled, admin assigns a cleaner or driver and confirms the appointment window. Client sees the booking status and can request a schedule change. After service, the provider records completion and the client can report an issue or confirm completion.
26. Changes to service scope, location, or appointment time that affect price or availability require a revised quote and client approval.
27. After service completion, admin records completion evidence and sends any outstanding balance or receipt, accounting for the deposit already paid.
28. Client pays the balance through hosted checkout. System confirms provider payment and issues receipt.
29. Client confirms service completion or reports an issue under the published remedy policy; booking becomes `COMPLETED` after required settlement or an authorized exception.
30. Client can view and download booking history, invoice, and receipts; optional feedback is collected.

## 2. Admin workflow

```text
New account
  → Verification queue
      → Approve → Verified client
      → Resubmission required → Client resubmits → Review again
      → Reject → Appeal/support path

Verified client
  → Request submitted for scoping
      → Need information ↔ Client response
      → Quote issued → Client accepts quote
          → Deposit checkout → Provider confirmation
              → Paid review queue
                  → Accept → Service booking → Final invoice → Final payment → Complete
                  → Reject → Refund decision → Refund confirmation/exception
                  → Need information ↔ Client response → Re-review
```

### Admin queue rules

- Verification queue contains only authorized reviewer work; document access is logged.
- Paid request queue contains only requests with a confirmed deposit and valid accepted quote.
- Payment exceptions are visible in a separate reconciliation queue and never appear as paid until resolved.
- Admin decisions require a reason where they materially affect the client (reject, suspend, refund exception).
- Every status change, quote revision, invoice issue, payment/refund event, and sensitive document view is attributable and timestamped.

## 3. State flow

### Account

`PENDING_VERIFICATION → UNDER_REVIEW → VERIFIED`

Alternative paths: `UNDER_REVIEW → RESUBMISSION_REQUIRED → UNDER_REVIEW`; `UNDER_REVIEW → REJECTED → APPEAL/REVIEW`; any active account may become `SUSPENDED` under an authorized decision.

### Request and project

`DRAFT → AWAITING_QUOTE → AWAITING_DEPOSIT → PAYMENT_PENDING → PAID_PENDING_REVIEW → ACCEPTED → IN_PROGRESS → AWAITING_FINAL_PAYMENT → COMPLETED`

Alternative states include `NEEDS_INFORMATION`, `REJECTED`, `CANCELLED`, `REFUND_PENDING`, and `REFUNDED`. Transitions are role-controlled and audited.

### Payment

`CREATED → PENDING → PAID | FAILED | CANCELLED`

After confirmed payment: `PAID → REFUND_PENDING → PARTIALLY_REFUNDED | REFUNDED`; chargebacks/disputes follow provider events and finance review. Duplicate provider events do not change the outcome twice.

## 4. Exception paths

| Situation | Client experience | Admin/system action |
|---|---|---|
| Upload unreadable or unsupported | Clear error with upload guidance | No review decision until valid file received. |
| Verification provider unavailable | “Under review” with status updates | Queue for retry or manual review; do not approve by default. |
| Verification rejected | Reason category and appeal/resubmit route | Record decision and reviewer; retain/delete according to policy. |
| Payment delayed | Pending status; no duplicate payment prompt unless safe | Reconcile by provider reference; keep request out of paid queue. |
| Payment succeeds but webhook delayed | Processing status | Scheduled reconciliation confirms payment; idempotent update. |
| Deposit amount mismatch | No paid confirmation | Flag exception; investigate/refund or collect difference under approved process. |
| Request rejected after deposit | Decision and refund status shown | Record policy basis, initiate refund if due, reconcile provider confirmation. |
| Client account suspended during active work | Support contact and limited access message | Preserve project/finance records and define authorized servicing/refund route. |
| Service, location, or appointment changes | Revised quote and explicit acceptance | Reconfirm availability and price before the change is accepted. |

## 5. Notifications

Send email/in-app notices for email confirmation, verification status, resubmission, request receipt, information requests, quote issued/changed/expiring, deposit processing/confirmation/failure, admin decision, appointment confirmation, reminder, or completion update, invoice, payment receipt/refund, completion, and account suspension. Notifications should link to authenticated pages and never include identity documents, selfie images, passwords, or full payment credentials.

## 6. Journey principles

- Explain each status in plain language and show the next action and expected response time.
- Do not imply automated identity checks guarantee authenticity.
- Keep sensitive verification files out of ordinary request and notification views.
- Show the full quote and applicable terms before the client pays.
- Distinguish payment initiated from payment confirmed.
- Make support and review routes visible at every point where access or money is blocked.
