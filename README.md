# Elixir Exercise

## Endpoints are documented in Postman

Two headers are relevant for all endpoints:

- `x-elixir-api-key` - the api key for the user. can be either 'foo' or 'bar'. Monsters Get is public
- `Authorization` - where the JWT would normally go. For this exercise, it's just a stub with two values representing the two roles: 'elixir-ceo' and 'bmike'

## Requirements

- [ ✅ ]: MongoDB config
- [ ✅ ]: Auth config
- [ ❌ ]: Redis config

- [ ✅ ]: Monster Mongoose Schema

- [ ✅ ]: Monster CRUD:

  - ✅: Create 'only BMike'
  - ✅: Read 'only BMike can see secret notes'
  - ✅: Update 'only BMike'
  - ✅: Delete 'only BMike'

- [ ✅ ]: Gold PUT

  - [ ✅ ]: Add gold to monster 'only CEO'
  - [ ✅ ]: Removal only by BMike

- [ ✅ ]: Authorization stub
  - [ ✅ ]: rate limiting based on IP & api key
  - [ ✅ ]: role based access control
  - [ ✅ ]: Reset Password
