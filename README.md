# Elixir Exercise

## Requirements

Note: "%" indicates an optional requirement

#### App Config:

- [ x ]: MongoDB config
- [ ]: Auth Guard config
- [ ]: % Redis config

#### Persistence:

- [ - ]: Monster Mongoose Schema
- [ ]: User Mongoose Schema
  - Two possible roles: BMike, CEO

#### Controllers:

- [ ]: Monster CRUD
  - GET
    - public
    - % Pagination
  - POST
    - private
- [ ]: Gold PUT
  - Addition only by CEO
  - Removal only by BMike

#### Nice to haves (not implemented):

- Proper error handling: custom errors, error middleware
- Custom logger, especially for tools like Sentry

#### Smoke test cases:

- [ ]: Create a monster (only BMike)
- [ ]: Get a monster
  - [ ]: Public user can't see private notes
  - [ ]: Private user can see private notes correctly decrypted
  - [ ]: Monster password is never returned
- [ ]: Update a monster
- [ ]: Delete a monster
