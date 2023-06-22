# Reaction content type

This package provides an XMTP content type to support reactions to messages.

### What’s a reaction?

A reaction is a way to respond to messages.

Reactions are repesented as objects with the following keys:

- `reference`: The message ID for the message that is being reacted to
- `action`: The action of the reaction (`added` or `removed`)
- `content`: A string representation of a reaction (e.g. `smile`) to be interpreted by clients

### Create a reaction

```tsx
const reaction: Reaction = {
  reference: someMessageID,
  action: "added",
  content: "smile",
};
```

### Send a reaction

Now that you have a reaction, you can send it:

```tsx
await conversation.messages.send(reaction, {
  contentType: ContentTypeReaction,
  contentFallback: `[Reaction] ${client.address} reacted to ${someMessage.content} with:\n\n${reaction.content}`,
});
```

Note that we’re using `contentFallback` to enable clients that don't support these content types to still display something. For cases where clients *do* support these types, they can use the content fallback as alt text for accessibility purposes.

### Receive a reaction

Now that you can send a reaction, you need a way to receive a reaction. For example:

```tsx
// Assume `loadLastMessage` is a thing you have
const message: DecodedMessage = await loadLastMessage();

if (!message.contentType.sameAs(ContentTypeReaction)) {
  // We do not have a reaction. A topic for another blog post.
  return;
}

// We've got a reaction.
const reaction: Reaction = message.content;
```

### Display the reaction

Generally, reactions should be interpreted as emoji. So, `smile` would translate to :smile: in UI clients. That being said, how you ultimately choose to render a reaction is up to you.

## Developing

Run `yarn dev` to build the content type and watch for changes, which will trigger a rebuild.

## Testing

Before running unit tests, start the required Docker container at the root of this repository. For more info, see [Running tests](../../README.md#running-tests).

## Useful commands

- `yarn build`: Builds the content type
- `yarn clean`: Removes `node_modules`, `dist`, and `.turbo` folders
- `yarn dev`: Builds the content type and watches for changes, which will trigger a rebuild
- `yarn format`: Runs prettier format and write changes
- `yarn format:check`: Runs prettier format check
- `yarn lint`: Runs ESLint
- `yarn test:setup`: Starts a necessary docker container for testing
- `yarn test:teardown`: Stops docker container for testing
- `yarn test`: Runs all unit tests
- `yarn typecheck`: Runs `tsc`