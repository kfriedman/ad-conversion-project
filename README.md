# Ad Conversion Project

This repo contains information and a Proof of Concept (PoC) for a hypothetical project to display ads and track conversions from those ads.

## Summary

The objective of this project is to provide a mechanism for *Publishers* to display *Ads* at one point in time and for *Advertisers* to track *Conversions* from those *Ads* at a later point in time.

To accomplish this objective, server-side and client-side components will be created.

This project will be built by 4 engineers over a period of 6 weeks (24 engineer weeks) with adequate time for testing, QA, and production readiness.

### Demo

[Publisher](https://jxxhqfb2ll.execute-api.us-east-1.amazonaws.com/development)

[Advertiser](https://jxxhqfb2ll.execute-api.us-east-1.amazonaws.com/development/advertiser)

## Architecture

### Server-Side

#### Ad Display Service

- Serve relevant Ads to a Publisher website via a RESTful API
  - Example `GET` endpoint: `/publishers/[id]/ads`
- Provide a mechanism (e.g. cookies) to track (for a determinate period of time) that an Ad was shown to a Client
- An appropriate datastore (e.g. NoSQL or Relational Database Service) will be used to retrieve/store Ads

#### Conversion Service

- Allow Advertisers to transmit a conversion event for an Ad from a Client via a RESTful API
  - Example `POST` endpoint: `/conversions` with a body of `adId`, `clientId`
- Decodes mechanism (e.g. cookie) set by Ad Display service to determine if a relevant Ad was shown
- Must not count the same conversion for an Ad from a Client more than once
- Should provide the ability to associate a value (e.g. total sale amount) with a Conversion
- An appropriate datastore (e.g. NoSQL or Relational Database Service) will be used to retrieve/store Conversions

### Deployment Environment

- API Gateway: used to route requests to appropriate services, provide authentication (if necessary), and allow for caching
- Serverless or Containers (ECS): used to provide the ability to scale services as necessary for high-volume traffic
- Streams (Kinesis/Kafka): Data will also be published to streams to provide other consumers with real-time access to data 

### Client-Side

#### Ad Client (JavaScript)

- Provide an easy mechanism for Publishers to display Ads from the Ad Service on a website
- Allow Advertisers to transmit conversion events to the Conversion Service on a website

### Deployment Environment

- CloudFront: used to provide edge caching of static resources, capability for significant traffic volume, and fast response times

## PoC Implementation

- [app.js](app.js): Express (Node.js) service intended by deployed as an AWS Lambda to demo an implementation of the Ad Display Service and Conversion Service
- [ads.js](js/ads.js): Demo client-side JavaScript used to interact with services
  - Requires jQuery but this will not a dependency for this project

## Delivery Timeline

### Phases

- _Requirements & Architecture: 2 engineer weeks_
  - Engineers collaborate with Product and other cross-functional stakeholders (UX, Project, etc.) to fully understand requirements and finalize architecture
- _Create E2E Alpha: 2.5 engineer weeks_
  - Initial E2E Alpha version to de-risk unknowns, decide and document contracts, and facilitate future parallel work
- _Ad Display Service: 6 engineer weeks_
  - Final production version of service deployed to all environments
- _Conversion Service: 6 engineer weeks_
  - Final production version of service deployed to all environments
- _Ad JavaScript Client: 4.5 engineer weeks_
  - Final production version of client deployed to all environments
- _Perform Production Readiness: 3 engineer weeks_
  - Adequate time for hardening of all components, "chaos" testing, setting up monitoring and alarms, etc.

## Assumptions & Notes

- Services may be further decomposed to aid in parallel development
- Team (as advised by Engineering Manager) will decide final architecture and design as well as address security issues during Requirements & Architecture phase
- A streaming/event-driven architecure may also be implemented to provide access to data in real-time for other uses.
- Best practices will be followed throughout project including:
  - *Testing:* Unit testing and integration testing will be implemented for all components
  - *CI/CD:* All components will be deployed via continuous deployment with automated testing
  - *Logging:* A logging standard will be developed and adhered to
  - *Peer Review and other coding practices:* All code will be reviewed by multiple developers
  - *Documentation:* Sufficient documentation will be created; especially comprehensive READMEs
  - *QA:* Performed throughout development process
