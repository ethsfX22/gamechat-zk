# How to run

Use `yarn` to install the packages and run the project.

```
yarn install
```

For development server

```
yarn run dev
```

For production, build the code

```
yarn run build
```

and then you can transfer to a dedicated hosting service.

# GameChat User Credential

## Credential Generation

To generate credentials, go to `<hostname>/issue`
Here, you can enter your date of birth, name, and role.
The generated credentials along with zkCircuits are used
to grant you access and privileges in GameChat world.

1. Put in your information (Ideally sourced using WorldCoin)
2. Issue Credentials stores both your zkCredentials and relevant
   zkCircuit in the localStorage

## Credential Verification

Credential verification is done by the GameChat extension
to grant you access to the chat. Additionally, if you have the mod
role as part of your `DID`, then you can also get special
access in the chat.

If your role is `mod` or `admin` you have privileges to 'ban',
'unban', etc. other users on the GamerChat chat server (based on XMTP)

To verify your credential, go to `<hostname>/verify`
