# Team Collaboration

Vectorr teams share conversion workspaces, threaded comments, and version checkpoints. Team features use the authenticated Supabase server client and database row-level security.

## Roles and Permissions

- **Owner**: represented by `teams.owner_id` and the `admin` team-membership role in the current schema. Owners manage membership and retain full workspace control.
- **Editor**: can work with shared team conversions and contribute comments.
- **Viewer**: read-only access to shared team work.

The database schema's membership constraint is `admin`, `editor`, or `viewer`. The application presents `admin` as Owner; non-owner invitations can be Editors or Viewers. The Team plan is priced at $39/month and includes three seats. Seat limits should be enforced at subscription/invitation boundaries when billing is connected.

## Member Management

`TeamWorkspace` loads members from `GET /api/teams/[id]/members`. Owners can invite existing accounts by email, change non-owner roles with `PATCH /api/teams/[id]/members/[userId]`, or remove members with `DELETE`. Requests verify the signed-in user and owner status. New invitations currently require an existing Supabase account; sending an email invitation for an unregistered address requires an email delivery flow.

## Comments

Threaded comments use the existing `conversion_comments` table (`parent_id` stores the reply relationship). `POST /api/comments` creates a top-level comment or reply; `GET /api/comments?conversionId=...` returns threads. `PATCH` and `DELETE` operate on `commentId` and are restricted to the comment author. Conversion accessibility is additionally controlled by RLS.

## Version History

Version checkpoints use `conversion_versions`, with monotonically increasing per-conversion version numbers, a checkpoint name, file URL, metadata, and creator. `VersionHistoryManager` can record/list checkpoints and restore a checkpoint only on the conversion it belongs to. Restores create a new checkpoint rather than deleting history.

## Upcoming

Real-time collaboration and live presence are not included in Phase 1. Supabase Realtime subscriptions can be added for conversion comments and version events after the shared workspace UI is established.
