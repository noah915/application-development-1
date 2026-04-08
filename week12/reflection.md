# Reflection

## What is the difference between authentication and authorization?

Authentication is the process of verifying the identity of a user, such as checking their username and password to confirm who they are. Authorization, on the other hand, is determining what actions or resources a user is allowed to access after they have been authenticated, based on their permissions or roles.

## Why does /admin return 403 for a regular user instead of 401?

The /admin route returns 403 Forbidden for a regular user because the user is logged in (authenticated), but they do not have the necessary permissions (authorization) to access the admin-only resource. A 401 Unauthorized would be returned if the user was not logged in at all.

## Why is ownership checking important?

Ownership checking is important to ensure that users can only access or modify resources that belong to them, preventing unauthorized access to other users' data. This helps maintain data privacy and security in multi-user applications.

## What is the difference between role-based access and ownership-based access?

Role-based access control (RBAC) grants permissions based on the user's assigned role, such as admin or user, allowing certain actions for all users in that role. Ownership-based access, however, grants permissions based on whether the user owns the specific resource, regardless of their role, allowing more granular control over individual items.

## Why should authorization checks happen on the server instead of the client?

Authorization checks should happen on the server because client-side checks can be easily bypassed or manipulated by users through browser tools or by modifying the client code. Server-side checks ensure that security rules are enforced reliably and cannot be circumvented, protecting sensitive data and operations.