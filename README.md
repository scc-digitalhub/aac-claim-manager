# Claim Manager

User Claims Manager based on the AAC API. Allows for creating defining claims for a specific users and services.
It is possible to manage only the custom claims of the services the signed in user has access to. The association
of claims is based on the username (email). The form for the claim definition is generated automatically,
based on the claim definitions (i.e, cardinality and type).

## Project setup and Usage

Prepare dependencies, compile and hot-reload for development, compiles and minifies for production
```
npm install
npm run serve
npm run build
```

The Claim Manager requires the AAC instance up and running. The configuration (see corresponding .env files)
requires reference to the AAC endpoint and the client ID for the implicit authorization flow. The corresponding
client app requires the following scopes enabled: 

- ``openid`` and ``profile`` for basic information about the signed in user
- ``servicemanagement.me`` for accessing the available service list
- ``claimmanagement.me`` for managing claims of AAC users