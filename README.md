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

## Claim Management Scenario

The scenario makes reference to a situation, where a custom resource (e.g., a new application or a service), needs to manage abd access specific user attributes without necessarily storing them internally. An example of such a situation is a new application, where some user may have some application-specific previleges to perform certain operations. To avoid creating a management console, where these users will be associated with these custom role-like properties, it is possible to use AAC to store these properties as custom claims. 

The scenario, therefore, consists of the following steps:

1. Defining a new service model with the corresponding claims and scopes. Using AAC management console, the developer should create a new service definition and declare the necessary claims. For example, assuming a new servce ``myService`` and a necessity to manage specific access level property that contains a list of actions the end user may perform on the service, it is necessary to declare an ``accesslevel`` claim of type string array. 
2. Within the same definition, it is also necessary to declare a scope, e.g., ``accesslevel.me`` and associate it to the ``user`` type and to the above scope. In this way, to retrieve the access level of the authorized user it will be necessary for the user to grant the corresponding scope permission to the 3rd part apps accessing the service.
3. Configure the  claim ``accesslevel`` for the user of interest throught the claim management console. The access to the claim management console for the ``myService`` service is available to the same user that has created the service definition (or, following the AAC role model, has access to the same service context).
4. If the end user is authenticated with AAC and the client requests the access to the ``accesslevel.me`` scope, the custo user claim will be available as a part of the emitted JWT token claims. Otherwise, it is possible to read the information about the claims of the user through AAC Custom User Claim API.