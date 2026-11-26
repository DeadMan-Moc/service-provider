# ServiceHub System Requirements

**Version:** 1.0  
**Date:** 25 November 2026  
**Scope:** Initial web platform for a South African service business.

## 1. Purpose and scope

ServiceHub enables clients to register, verify identity, request a service, accept a quote, pay a deposit, and track appointments. Administrators manage verification, paid bookings, staff schedules, invoices, payments, and audit history.

The system does not itself guarantee identity authenticity or service outcomes. Document authenticity and face comparison depend on configured verification services and/or trained human review. Card data is handled by a payment provider; ServiceHub stores provider references and payment state only.

## 2. Actors and permissions

| Actor | Permissions |
|---|---|
| Visitor | View public service information, register, sign in, request account recovery. |
| Client | Manage own profile; submit verification; view own verification status; create and view own bookings/quotes/appointments/payments; respond to information requests; pay through provider checkout. |
| Verification reviewer | View assigned identity submissions; record approve/reject/resubmission decision and reason; no payment or booking administration unless separately granted. |
| Service administrator | Review requests, issue quotes, accept/reject paid requests, request information, manage booking statuses and staff schedules and invoices, initiate permitted refunds. |
| System administrator | Manage roles, service catalogue/configuration and integrations; access sensitive identity data only when explicitly authorized and audited. |

Use least privilege and separate roles where staffing allows. Administrative actions require authenticated accounts and stronger authentication.

## 3. Functional requirements

### Accounts and access

- **FR-01:** Register with name, surname, email, phone number, and password. Require unique normalized email; validate email and phone formats.
- **FR-02:** Verify email ownership before enabling account recovery and important notifications. Phone verification can be configured as an additional check.
- **FR-03:** Set new accounts to `PENDING_VERIFICATION`; do not permit service-request creation or platform dashboard access until `VERIFIED` (allow only a restricted verification/status screen while pending).
- **FR-04:** Support secure login, logout, password reset, session expiry, rate limiting, and account suspension. Suspended accounts cannot create/pay for requests; define handling for active bookings separately.
- **FR-05:** Provide role-based access control for clients, reviewers, and administrators; enforce authorization in the API, not only in the UI.

### Identity verification

- **FR-06:** Accept configured document types: South African ID, passport, or driver’s licence, plus a selfie image. Record type, submission time, consent/notice version, and verification status.
- **FR-07:** Validate file type, size, and malware risk; store files in private object storage using opaque identifiers. Never expose public object URLs.
- **FR-08:** Submit permitted data to the configured verification provider, or place it in a human-review queue. Record provider reference, result, confidence/reason codes, and timestamps without treating a low-confidence response as a definitive decision.
- **FR-09:** Allow reviewer outcomes `APPROVED`, `REJECTED`, or `RESUBMISSION_REQUIRED`, each with a reason and reviewer identity. Notify client and provide a secure resubmission route.
- **FR-10:** Record decision changes in an append-only audit trail. Support a review/appeal path for declined checks.
- **FR-11:** Restrict document viewing to authorized reviewers, log every view/download, and apply a configured retention/deletion policy.

### Service requests and quoting

- **FR-12:** Show configured service types: Home Cleaning, Office Cleaning, Laundry Service, Mobile Car Wash, and Other Cleaning Service.
- **FR-13:** Let verified clients submit service/request title, service type, requesting area (suburb/city), street address, preferred service date and time window, service-specific details (rooms/tasks, laundry load and pickup/delivery, or vehicle make/model and wash package), access instructions, and optional attachments. Validate required fields and attachment limits.
- **FR-14:** Support draft/edit before quote acceptance. Validate the requesting area and street address against configured coverage areas and show when the requested date is unavailable. Record submission and every subsequent status transition.
- **FR-15:** Admin can request more information; client can reply and attach files. Notify affected parties and log the exchange.
- **FR-16:** Admin can create a versioned quote with currency (ZAR), quoted total, deposit amount, remaining balance, service location/date, inclusions, exclusions, travel or access fees, validity date, rescheduling/cancellation/refund terms, and any service-specific conditions.
- **FR-17:** Client must explicitly accept the active quote/terms before deposit checkout. Preserve the accepted version and timestamp.

### Deposits and payment reconciliation

- **FR-18:** Create hosted checkout with the configured provider (initially one provider selected for pilot). Never collect or store full card credentials.
- **FR-19:** Mark a payment `PENDING` until a verified server-to-server provider notification or reconciliation confirms it. A browser success redirect alone must not confirm payment.
- **FR-20:** Verify webhook signature/authenticity; process events idempotently; store provider transaction identifiers and event timestamps; handle out-of-order and duplicate notifications.
- **FR-21:** Move the request to the paid-review queue only after deposit status is `VERIFIED/PAID` and the quote is still valid. Notify client and admin.
- **FR-22:** Provide payment states including `CREATED`, `PENDING`, `PAID`, `FAILED`, `CANCELLED`, `REFUND_PENDING`, `PARTIALLY_REFUNDED`, `REFUNDED`, and `DISPUTED` as supported by provider/business process.
- **FR-23:** Provide an admin reconciliation view for provider reference, expected amount, confirmed amount, status, and exceptions. Prevent a mismatch from silently releasing work.

### Booking and service management

- **FR-24:** Admin can accept or reject a paid request, or request more information. Rejection requires a reason and triggers the configured refund decision/process.
- **FR-25:** Track booking states: `DRAFT`, `AWAITING_QUOTE`, `AWAITING_DEPOSIT`, `PAYMENT_PENDING`, `PAID_PENDING_REVIEW`, `NEEDS_INFORMATION`, `ACCEPTED`, `SCHEDULED`, `IN_PROGRESS`, `AWAITING_FINAL_PAYMENT`, `COMPLETED`, `REJECTED`, `CANCELLED`, `REFUND_PENDING`, `REFUNDED`.
- **FR-26:** Validate allowed transitions and record actor, timestamp, prior/new state, and reason. Do not let clients alter admin-controlled states.
- **FR-27:** Admin can schedule a staff member, record appointment changes, completion notes, and client-visible updates. Prevent schedule conflicts. Notify clients on meaningful changes.
- **FR-28:** Support changes to service scope, address, or booking time through a revised quote and client approval before additional charges.

### Final balance and completion

- **FR-29:** Admin can issue an itemized final invoice showing total, deposits/credits, remaining amount, due date, and invoice identifier.
- **FR-30:** Client can pay outstanding balance through hosted payment. Reconcile payment using the same verified event controls as deposits.
- **FR-31:** Mark a booking `COMPLETED` only after delivery acceptance (or a configured acceptance process) and required balance settlement or an explicit authorized exception.
- **FR-32:** Generate downloadable invoice/receipt documents and preserve their versions and associated payment records.

### Notifications, support, and audit

- **FR-33:** Email notifications for registration, verification status, information requests, quote changes, payment outcomes, request decisions, booking updates, invoices, and receipts. Avoid sensitive ID/selfie data in notification content.
- **FR-34:** Maintain a searchable audit trail for authentication-sensitive events, document access, verification decisions, quote acceptance, state changes, payment events, refunds, role changes, and administrative actions.
- **FR-35:** Provide clients an account view of verification status, booking history, quotes, invoices, and payment status, restricted to their own records.
- **FR-36:** Admin dashboards show verification work and only bookings whose deposit is confirmed as paid, except a separate payment-exception view for reconciliation staff.

## 4. Core data entities

- `User`: identity/contact fields, password hash, role(s), account status, timestamps.
- `VerificationCase`: user, document type, protected object reference, provider reference, status, reasons, reviewer, timestamps, retention/deletion date.
- `ServiceType`: display name, intake schema, enabled status, pricing method.
- `ServiceRequest`: client, service, booking title, requesting area (suburb/city), street address, requested date/time window, service details, access instructions, attachments, status, timestamps.
- `Quote`: request, version, scope, amounts, deposit, terms snapshot, expiry, client acceptance metadata.
- `Payment`: request/quote/invoice, provider, provider reference, amount/currency, state, event references, timestamps.
- `Booking`: accepted request, assigned staff member, service address, date/time window, status, completion notes, and client feedback.
- `Invoice`: booking, line items, total, credits, outstanding amount, issue/due dates, document reference.
- `AuditEvent`: actor, action, target, time, result/reason, correlation ID; avoid logging secrets or raw documents.

## 5. Non-functional requirements

- **Security:** TLS in transit; strong password hashing; secrets in managed secret storage; private encrypted document storage; encryption at rest; least privilege; admin MFA; secure headers; CSRF protection where applicable; input validation; upload scanning; dependency and patch management; backup protection; incident response procedure.
- **Privacy:** collect only information necessary for stated verification/service purposes; present clear notices and applicable consent/authorization; define retention and deletion; support access/correction requests; contract with service providers processing data; assess cross-border processing and biometric/face-processing implications with South African privacy counsel.
- **Reliability:** payment and request state transitions must be transactional and idempotent. Backups and restore objectives must be defined before production. Integration failures must leave requests in a recoverable pending/exception state.
- **Performance:** ordinary dashboard/API actions should meet an agreed response-time target under expected pilot load; uploads should use bounded size and asynchronous processing where needed.
- **Accessibility/usability:** responsive web UI, keyboard operation, clear field errors, accessible status labels, and understandable upload instructions.
- **Observability:** structured logs, metrics, alerting for payment/verification failures, and traceable request/payment correlation IDs; do not put passwords, card data, ID images, or selfie images in logs.
- **Maintainability:** versioned APIs and database migrations; separate provider adapters; documented state transitions and admin procedures.

## 6. Recommended technical boundaries

React frontend → Spring Boot API → PostgreSQL. Use private object storage for files, a background worker/queue for verification and notifications, and provider adapters for identity and payment services. The API owns authorization and business state. The browser is never trusted to assert verification or payment success.

## 7. Service-specific operating requirements

- Configure bookable service areas by suburb/postcode and block unavailable locations or dates before payment.
- Home/office cleaning intake captures property type/size, room and bathroom count, requested tasks, and access notes.
- Laundry intake captures estimated load or item list, wash/dry/fold preferences, special-care notes, and collection/delivery addresses and time windows.
- Mobile car wash intake captures vehicle type/make/model, selected wash package, parking/location details, and whether customer water and power are available or required.
- Admin scheduling prevents staff double-booking. Confirmation and reminder messages include the service address, booking window, and rescheduling route.
- Record service completion and support a defined re-clean, re-wash, or service remedy process.

## 8. Acceptance criteria for the critical path

1. A pending or rejected client cannot create a paid service request.
2. A verified client can submit a request and receive a versioned quote.
3. No request enters paid admin review until the accepted quote’s deposit is confirmed by a verified provider event/reconciliation.
4. Duplicate payment notifications cannot create duplicate payment records or repeated state changes.
5. Admin actions and identity-file access are attributable to a named account in audit history.
6. A client cannot see another client’s profile, documents, requests, invoices, or payment records.
7. Payment mismatch, provider timeout, and verification-provider outage produce visible recoverable exceptions.
8. Document retention/deletion and account suspension behavior can be applied and audited.

## 8. Service-specific operating requirements

- Define coverage suburbs/postcodes and show availability before checkout; do not accept bookings outside active coverage.
- Cleaning requests capture property type/size, rooms, bathrooms, requested tasks, and access notes.
- Laundry requests capture item/load estimate, wash preferences, special-care notes, and collection/delivery addresses and windows.
- Mobile car wash requests capture vehicle type, make/model, wash package, parking/location details, and water/power availability requirements.
- Admin scheduling must avoid double-booking staff/time slots. Confirmation and reminders must include the appointment window and rescheduling route.
- Record completion evidence and any client-reported service issue; define a re-clean, re-wash, or remedy workflow in business policy.

## 9. Assumptions and open decisions

- Currency and initial jurisdiction are ZAR/South Africa.
- “Only verified users access the platform” means non-verified users may access only registration, sign-in, verification submission/status, and account-support screens.
- Deposit is based on an admin-approved quote, not automatically on a raw request.
- Provider choices, quote policy, retention periods, legal terms, service-level targets, and deployment region remain to be selected.
- Applicable legal duties depend on the final business and payment model; obtain legal and privacy review before handling real identity documents.
