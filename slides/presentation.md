---
title: Teach yourself GraphQL in 2026
sub_title: an anti-blueprint
author: Jeff Auriemma
---

# TODO

1. Mermaid screenshots
2. Practice, do dry runs, create a branch incrementally
3. Fill in blank sections, particularly at the end

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

![](headshot-1.jpeg)

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

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

```graphql
type Query {
  flights(origin: String!, destination: String!, date: String!): [Flight!]!
}

type Flight {
  airline: String!
  departureTime: String!
  arrivalTime: String!
  legs: [Leg!]!
  price: Price
}

type Leg {
  airport: String!
  duration: Int!
}

type Price {
  amount: Float!
  currency: String!
}
```

<!-- column: 1 -->

**type** — a named object in your domain

**field** — a typed piece of data on a type

**scalar** — leaf type — `String`, `Int`, `Float`, `Boolean`, `ID`

**`!`** — non-null — the field will always have a value

**`[ ]`** — list

**arguments** — typed inputs declared on a field

<!-- reset_layout -->

<!-- new_line -->

Every field selected in the query has a definition here. The schema defines what's _possible_; the query picks what it _wants_.

<!-- end_slide -->

# Resolvers

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

```ruby
class Types::QueryType < Types::BaseObject
  field :flights, [Types::FlightType], null: false do
    argument :origin, String, required: true
    argument :destination, String, required: true
    argument :date, String, required: true
  end

  def flights(origin:, destination:, date:)
    HTTP.get(
      "http://service-1/flights",
      params: { origin:, destination:, date: }
    ).parse
  end
end
```

<!-- column: 1 -->

**resolver** — a function that returns data for a field

**field** — declared once in the schema, implemented once as a method

**arguments** — arrive as keyword arguments, already typed and validated

**body** — plain runtime code (Ruby in this case) — call a database, a REST API, another service

<!-- reset_layout -->

<!-- new_line -->

The schema says _what_ `flights` returns. The resolver says _how_ to get it. GraphQL doesn't care what's underneath.

<!-- end_slide -->

# Anatomy of a GraphQL request

```mermaid +render
flowchart LR
    Client(["Client"]) -->|"query"| Parse["Parse"]
    Parse --> Validate{"Validate"}
    Schema[("Schema")] -.-> Validate
    Validate -->|"invalid"| Response(["{ data, errors }"])
    Validate -->|"valid"| Execute["Execute<br/>(resolvers)"]
    Execute --> Response
    Response --> Client
```

<!-- new_line -->

**Validate before execute** — bad queries never reach your resolvers.

**Query shape == response shape** — the client picks; the server delivers exactly that.

<!-- end_slide -->

# Changing data with mutations

<!-- end_slide -->

# Mutations

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

```graphql
mutation BookFlight($flightId: ID!, $passengerId: ID!) {
  bookFlight(
    flightId: $flightId,
    passengerId: $passengerId
  ) {
    booking {
      id
      status
    }
  }
}
```

<!-- column: 1 -->

- Same structure as a query — operation type, name, selection set
- For writes: creates, updates, deletes
- Returns data too — no need for a follow-up request

<!-- reset_layout -->

<!-- end_slide -->

# Resolving mutations

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

```go
func (r *mutationResolver) BookFlight(
    ctx context.Context,
    flightID, passengerID string,
) (*BookFlightPayload, error) {
    body, _ := json.Marshal(map[string]string{
        "flightId":    flightID,
        "passengerId": passengerID,
    })
    resp, err := http.Post("http://service-2/bookings", "application/json", bytes.NewReader(body))
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var booking Booking
    json.NewDecoder(resp.Body).Decode(&booking)
    return &BookFlightPayload{Booking: &booking}, nil
}
```

<!-- column: 1 -->

- Not the same as HTTP verbs
- Still resolvers — plain code, any language (here: Go + gqlgen)
- Same wiring as a query resolver — just write semantics
- Return the new state so the client doesn't need a follow-up read

<!-- reset_layout -->

<!-- end_slide -->

# Variables

Parameterize an operation — separate the document from the runtime values.

```graphql
mutation BookFlight($flightId: ID!, $passengerId: ID!) {
  bookFlight(
    flightId: $flightId,
    passengerId: $passengerId
  ) {
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

# Learning through schema design

With your agent...

1. Try to describe your data
2. Determine the best way to interact with your systems
3. Collaborate before committing
4. Some prefer schema-first, others code-first

<!-- end_slide -->

# Questions you'll be prompting later

<!-- end_slide -->

# How should I use fragments?

## Questions you'll be prompting later

```mermaid +render
flowchart TB
    Page["<b>FlightSearchPage parent component</b><br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>query FlightSearch($origin: String!, ...) {<br/>&nbsp;&nbsp;flights(origin: $origin, ...) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;...FlightCardFields<br/>&nbsp;&nbsp;&nbsp;&nbsp;...FlightLegsFields<br/>&nbsp;&nbsp;&nbsp;&nbsp;...FlightPriceFields<br/>&nbsp;&nbsp;}<br/>}"]

    Card["<b>FlightCard component</b><br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>fragment FlightCardFields on Flight {<br/>&nbsp;&nbsp;airline<br/>&nbsp;&nbsp;departureTime<br/>&nbsp;&nbsp;arrivalTime<br/>}"]

    Legs["<b>FlightLegs component</b><br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>fragment FlightLegsFields on Flight {<br/>&nbsp;&nbsp;legs {<br/>&nbsp;&nbsp;&nbsp;&nbsp;airport<br/>&nbsp;&nbsp;&nbsp;&nbsp;duration<br/>&nbsp;&nbsp;}<br/>}"]

    Price["<b>FlightPrice component</b><br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>fragment FlightPriceFields on Flight {<br/>&nbsp;&nbsp;price {<br/>&nbsp;&nbsp;&nbsp;&nbsp;amount<br/>&nbsp;&nbsp;&nbsp;&nbsp;currency<br/>&nbsp;&nbsp;}<br/>}"]

    Card -.->|colocated · composed| Page
    Legs -.->|colocated · composed| Page
    Price -.->|colocated · composed| Page

    classDef leftAlign text-align:left,font-family:monospace
    class Page,Card,Legs,Price leftAlign
```

<!-- end_slide -->

# How is GraphQL typesafe for `$MY_LANGUAGE`?

## Questions you'll be prompting later

(example of SDL -> TypeScript/Swift generation)

<!-- end_slide -->

# How should I secure my deployment?

## Questions you'll be prompting later

(PQs, depth/rate limiting)

<!-- end_slide -->

# What performance best practices should I mind?

## Questions you'll be prompting later

(PQs, client-side and server-side caching, defer)

<!-- end_slide -->

# Resources

(TBD)

<!-- end_slide -->
