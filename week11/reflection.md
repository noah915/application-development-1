# Reflection

## What is a session?
A session is server-side state that remembers a user across requests after they log in.

## What does the server store?
The server stores session data, including the authenticated user object in this app.

## What does the client store?
The client stores a session cookie that identifies the session to the server.

## Why does /profile fail before login?
Because no session user exists yet, so the route is blocked by the authentication middleware.

## Why does /profile work after login?
After successful login, the server saves the user in the session, so the protected middleware allows access.

## Why does /profile fail again after logout?
Logout destroys the session, removing the stored user data, so the protected route is no longer accessible.
