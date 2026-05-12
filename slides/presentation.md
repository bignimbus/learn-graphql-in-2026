---
title: Teach yourself GraphQL in 2026
sub_title: an anti-blueprint
author: Jeff Auriemma
theme:
  name: terminal-dark
---

# Why we're here

🤔

<!-- end_slide -->

# Why we're here

We want to make...

- better user experiences
- better apps
- better agents

**GraphQL** is the investment to make in 2026

<!-- end_slide -->

# The dream query

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```graphql
query FlightSearch {
  flights(origin: "JFK", destination: "LHR", date: "2026-06-01") {
    airline
    departureTime
    arrivalTime
    legs {
      airport
      duration
    }
    price {
      amount
      currency
    }
  }
}
```

<!-- column: 1 -->

A GraphQL query that contains an ideal representation of the data needed to create a full user experience

<!-- reset_layout -->

<!-- end_slide -->

# Query anatomy

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```graphql
query FlightSearch {
  flights(origin: "JFK") {
    airline
    legs {
      airport
      duration
    }
  }
}
```

<!-- column: 1 -->

**operation type** — `query`, `mutation`, `subscription`

**operation name** — optional, but always use one

**field** — a named piece of data

**argument** — parameterizes a field

**selection set** — `{ }` — describes the shape you want back

**nesting** — fields can contain fields

<!-- reset_layout -->

<!-- new_line -->

The response mirrors the shape of the query.

<!-- end_slide -->

# Introducing myself

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```graphql
query TalkIntro {
  me {
    name
    title
    company
    bio
    socials {
      github
      bluesky
      linkedin
    }
  }
}
```

<!-- column: 1 -->

![](headshot.jpeg)

<!-- reset_layout -->

<!-- end_slide -->

# GraphQL is

<!-- end_slide -->

# GraphQL is

... just a spec

:(

<!-- end_slide -->

# GraphQL is

... just a spec

:)

<!-- end_slide -->

# GraphQL is

- "just" a spec
- a means of expressing your domain objects
- a way to get new experiences, apps, and agents off the ground quickly

<!-- end_slide -->

# Learn GraphQL in 2026

## an anti-blueprint

This talk...

- is spontaneous and social
- focuses on basics and questions, not complexity and answers
- uses a prompt-driven narrative to match modern dev practices

<!-- end_slide -->

# Make the dream a reality

<!-- end_slide -->

# Schema

(show schema example here)

<!-- end_slide -->

# Resolvers

(show resolver example here)

<!-- end_slide -->

# Schema & Resolvers

<!-- end_slide -->

# Mutations

```graphql
mutation BookFlight($flightId: ID!, $passengerId: ID!) {
  bookFlight(flightId: $flightId, passengerId: $passengerId) {
    booking {
      id
      status
    }
  }
}
```

<!-- new_line -->

- Same structure as a query — operation type, name, selection set
- For writes: creates, updates, deletes
- Returns data too — no need for a follow-up request

<!-- end_slide -->

# Variables

Parameterize an operation — separate the document from the runtime values.

```graphql
mutation BookFlight($flightId: ID!, $passengerId: ID!) {
  bookFlight(flightId: $flightId, passengerId: $passengerId) {
    booking {
      id
      status
    }
  }
}
```

```json
{
  "flightId": "AA42",
  "passengerId": "u_8821"
}
```

<!-- new_line -->

`$variableName: Type` — declared at the top, passed separately at runtime.

<!-- end_slide -->

# Fragments — teaser

```graphql
query FlightSearch {
  flights(origin: "JFK") {
    airline
    departureTime # ← who renders this?
    legs {
      airport
    } # ← who renders this?
    price {
      amount
    } # ← who renders this?
  }
}
```

<!-- new_line -->

This query already has a shape.

Different fields will be rendered by different UI components.

There's a concept that formalizes exactly that relationship. Later.

<!-- end_slide -->

# Recipe Card: Operations — pass 1

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

**OPERATION TYPES**

Query

<!-- column: 1 -->

**ANATOMY**

Field
Selection set
Argument

<!-- column: 2 -->

**CLIENT TOOLING**

Apollo Client
urql
Relay
TanStack Query + graphql-request
gql.tada
Houdini
─────────────────────
GraphiQL / Apollo Sandbox
GraphQL LSP (VS Code)

<!-- reset_layout -->

<!-- end_slide -->

# Nullability

In most type systems: **non-null by default**, explicitly opt into nullable.

In GraphQL: **nullable by default**. `!` opts into non-null.

<!-- new_line -->

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```graphql
type Flight {
  origin: String
  destination: String
  price: Price
}
```

every field nullable —
`price` might be `null`,
but so might `origin`

<!-- column: 1 -->

```graphql
type Flight {
  origin: String!
  destination: String!
  price: Price
}
```

`origin` and `destination` will
always have a value — `price`
degrades gracefully if unavailable

<!-- reset_layout -->

<!-- new_line -->

AI marks everything `!` optimistically, or leaves everything nullable lazily.
**Neither is right. Every `!` is a design decision.**

<!-- end_slide -->

# The resolver

```javascript
const resolvers = {
  Query: {
    flights: async (_, args) => {
      const res = await fetch(`http://service-1/flights`);
      return res.json();
    },
  },
};
```

<!-- new_line -->

A resolver is just a function.

It can call a database, a REST API, a third-party service.
GraphQL doesn't care what's underneath.

<!-- end_slide -->

# Schema-first vs. code-first

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Schema-first**

Write SDL by hand.
Generate types and stubs from it.

Tools: GraphQL Code Generator, gql.tada

<!-- column: 1 -->

**Code-first**

Define types in your language.
SDL is generated from them.

Tools: varies by server library

<!-- reset_layout -->

<!-- new_line -->

A fork, not a right answer. Depends on team and language.

<!-- end_slide -->

# Recipe Card: Schema — pass 1

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

**SCHEMA CONCEPTS**

Type
Field
Nullability (`!`)
Resolver
Schema-first
Code-first

<!-- column: 1 -->

**SDL TYPES**

Object type
Scalar

<!-- column: 2 -->

**SERVERS BY LANGUAGE**

Apollo Server / Yoga (JS/TS)
Hot Chocolate (.NET)
Strawberry / Ariadne (Python)
gqlgen (Go)
graphql-ruby (Ruby)
Juniper (Rust)
Lighthouse (PHP/Laravel)

<!-- reset_layout -->

<!-- end_slide -->

# Fragments — DRY

Same fields appearing in two operations:

```graphql
fragment FlightDetails on Flight {
  origin
  destination
  departureTime
  legs {
    airport
    duration
  }
}
```

```graphql
query FlightSearch {
  flights(origin: "JFK") {
    ...FlightDetails
    price {
      amount
      currency
    }
  }
}

mutation BookFlight($flightId: ID!, $passengerId: ID!) {
  bookFlight(flightId: $flightId, passengerId: $passengerId) {
    flight {
      ...FlightDetails
    }
  }
}
```

<!-- end_slide -->

# Input types

Mutations take data in as well as returning it.

```graphql
type Mutation {
  bookFlight(input: BookFlightInput!): BookFlightPayload
}

input BookFlightInput {
  flightId: ID!
  passengerId: ID!
}
```

<!-- new_line -->

Input types look like object types but only flow one direction — **into** the server.

<!-- end_slide -->

# Recipe Card: Operations — pass 2

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

**OPERATION TYPES**

Query
**Mutation** ←
Subscription \*

<!-- column: 1 -->

**ANATOMY**

Field
Selection set
Argument
**Variable** ←
**Fragment** ←
Alias
Directive

<!-- column: 2 -->

**CLIENT TOOLING**

Apollo Client
urql
Relay
TanStack Query + graphql-request
gql.tada
Houdini
─────────────────────
GraphiQL / Apollo Sandbox
GraphQL LSP (VS Code)

<!-- reset_layout -->

<!-- new_line -->

`* real-time — out of scope today`

<!-- end_slide -->

# Recipe Card: Schema — pass 2

<!-- column_layout: [1, 1, 1] -->

<!-- column: 0 -->

**SCHEMA CONCEPTS**

Type
Field
Nullability (`!`)
Resolver
Schema-first
Code-first

<!-- column: 1 -->

**SDL TYPES**

Object type
Scalar
**Enum** ← \*
**Interface** ←
**Union** ←
**Input type** ←

<!-- column: 2 -->

**SERVERS BY LANGUAGE**

Apollo Server / Yoga (JS/TS)
Hot Chocolate (.NET)
Strawberry / Ariadne (Python)
gqlgen (Go)
graphql-ruby (Ruby)
Juniper (Rust)
Lighthouse (PHP/Laravel)

<!-- reset_layout -->

<!-- new_line -->

`* adding enum values is a breaking change`

<!-- end_slide -->

# Two languages in a trenchcoat

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Query language**

for clients

describes what you _want_

```graphql
query FlightSearch {
  flights(origin: "JFK") {
    airline
    departureTime
    price {
      amount
      currency
    }
  }
}
```

<!-- column: 1 -->

**SDL**

for servers

defines what's _possible_

```graphql
type Query {
  flights(origin: String!): [Flight!]
}

type Flight {
  airline: String!
  departureTime: String!
  price: Price
}
```

<!-- reset_layout -->

<!-- new_line -->

Knowing which one you're in tells you whose job it is.
In the AI era: knowing the difference makes you a better prompter.

<!-- end_slide -->

# Recipe Card: Production

<!-- column_layout: [2, 1, 2] -->

<!-- column: 0 -->

**FUTURE PROMPT**

"why is my query slow"

"someone is querying my schema"

"nested query took the server down"

"where does authorization go"

"what are my clients running"

"can my AI agent use this API"

<!-- column: 1 -->

**CONCEPT**

Batching

Introspection

Query protection

Authorization

Observability

Agent-readiness

<!-- column: 2 -->

**VOCABULARY**

DataLoader

disable in prod

depth / complexity limiting
persisted queries / trusted documents

resolver-level auth
@authenticated / @requiresScopes

Apollo GraphOS / GraphQL Hive / Stellate

MCP + introspection

<!-- reset_layout -->

<!-- end_slide -->

# Fragments — component colocation

Each component owns the fields it needs to render.

```graphql
fragment PriceBadge_flight on Flight {
  price {
    amount
    currency
  }
}

fragment FlightCard_flight on Flight {
  airline
  departureTime
  arrivalTime
  ...PriceBadge_flight
}

query FlightSearch {
  flights(origin: "JFK", destination: "LHR") {
    ...FlightCard_flight
  }
}
```

<!-- end_slide -->

# Fragment naming convention

`ComponentName_typeName`

<!-- new_line -->

- Tells you **who owns** this fragment
- Tells you **what type** it's on
- AI generates anonymous or lazy names — specify the convention explicitly

<!-- new_line -->

Fragments are not abbreviations. **Fragments are contracts.**

When `PriceBadge` changes, one fragment changes. Nothing else breaks.

<!-- end_slide -->

# Further reading

_[QR codes]_

<!-- new_line -->

- Recipe book repo
- Component-collocated fragments — Relay docs
- Apollo Federation — federation.dev
- DataLoader — github.com/graphql/dataloader
- Persisted queries — your server library's docs
- N+1 and DataLoader — deep dive

<!-- end_slide -->
